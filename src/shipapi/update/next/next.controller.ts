import {
  Controller,
  Get,
  Headers,
  HttpException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TimeoutInterceptor } from 'src/timeout.service';
import axios from 'axios';

const sm_url = 'https://robertsspaceindustries.com/ship-matrix/index';
const fl_url = 'https://api.fleetyards.net/v1/';
const p4k_url =
  'https://raw.githubusercontent.com/ArisCorporation/p4k/main/latest/json/v2/';
const cms_url = 'https://cms.ariscorp.de/';

interface Ship {
  id?: string;
  status?: string;
  name?: string | null;
  slug?: string | null;
  p4k_mode?: boolean;
  p4k_id?: string | null;
  p4k_name?: string | null;
  p4k_version?: string | null;
  manufacturer?: string;
  store_url?: string | null;
  sales_url?: string | null;
  erkul_id?: string | null;
  fl_id?: string | null;
  sm_id?: number | null;
  pledge_price?: number | null;
  price?: number | null;
  length?: number | null;
  beam?: number | null;
  height?: number | null;
  mass?: number | null;
  on_sale?: boolean;
  cargo?: number | null;
  production_note?: string | null;
  live_patch?: string | null;
  hydrogen_fuel_tanks?: number | null;
  quantum_fuel_tanks?: number | null;
  crew_min?: number | null;
  crew_max?: number | null;
  speed_max?: number | null;
  speed_scm?: number | null;
  zero_to_scm?: number | null;
  zero_to_max?: number | null;
  scm_to_zero?: number | null;
  max_to_zero?: number | null;
  pitch_max?: number | null;
  roll_max?: number | null;
  yaw_max?: number | null;
  axis_acceleration_x?: number | null;
  axis_acceleration_y?: number | null;
  axis_acceleration_z?: number | null;
  acceleration_main?: number | null;
  acceleration_retro?: number | null;
  acceleration_vtol?: number | null;
  acceleration_maneuvering?: number | null;
  brochure?: string | null;
  hologram?: string | null;
  loaners?: string[] | null;
  variants?: string[] | null;
  size?: number | null;
  size_label?: string | null;
  insurance_claim_time?: number | null;
  insurance_expedited_cost?: number | null;
  insurance_expedited_time?: number | null;
  store_image?: string | null;
  store_image_url?: string | null;
  commercial_video_id?: string | null;
  ground?: boolean;
  gravlev?: boolean;
  description?: string | null;
  history?: string | null;
  rating?: number | null;
  production_status?: string | null;
  field_overwrite?: string[] | null;
}

// Function to fetch the Live ship list from sm_url
async function fetchLiveShipList(): Promise<any[]> {
  try {
    const { data: response } = await axios.get(
      cms_url + 'items/ships?limit=-1',
    );
    return response.data;
  } catch (error) {
    // throw new Error('Error fetching live ship list: ' + error);
    // console.error('Error fetching live ship list: ' + error);
    // return [];
    throw new HttpException('Error fetching live ship list', 500);
  }
}

// Function to fetch the FL ship list from sm_url
async function fetchFlShipList(): Promise<any[]> {
  try {
    const perPage = 240;
    let page = 1;
    let allData: any[] = [];

    while (true) {
      const { data: response } = await axios.get(
        fl_url + `models?perPage=${perPage}&page=${page}`,
      );

      if (response.length === 0) {
        break;
      }

      allData = allData.concat(response);
      page++;
    }

    return allData;
  } catch (error) {
    // throw new Error('Error fetching FL ship list: ' + error);
    // console.error('Error fetching FL ship list: ' + error);
    // return [];
    throw new HttpException('Error fetching FL ship list', 500);
  }
}

// Function to fetch the FL ship variants from sm_url
async function fetchFlShipVariants(slug: string): Promise<any[]> {
  try {
    const { data: response } = await axios.get(
      fl_url + 'models/' + slug + '/variants',
    );
    return response;
  } catch (error) {
    // throw new Error('Error fetching live ship list: ' + error);
    // console.error('Error fetching live ship list: ' + error);
    // return [];
    throw new HttpException('Error fetching fl ship loaners', 500);
  }
}

// Function to get a array of loaners for a ship
async function getLoaners(
  shipData: any,
  liveShipList: any[],
  flShipList: any[],
): Promise<{ ship_id: string; loaner_id: string }[]> {
  const getFlData = () =>
    flShipList.find((ship) => ship.id === shipData.fl_id) || {};

  const flData = getFlData();

  if (
    !flData ||
    flData === undefined ||
    flData === 'undefined' ||
    !flData.slug ||
    flData.slug === undefined
  )
    return null;

  const loaners = flData.loaners?.map(
    (loaner: { name: string; slug: string }) =>
      liveShipList.find(
        (ship) =>
          ship.fl_id ===
          flShipList.find(
            (ship) => ship.name === loaner.name || ship.slug === loaner.slug,
          )?.id,
      )?.id,
  );

  const ships_loaners = loaners?.map((loaner: string) => ({
    ship_id: shipData.id,
    loaner_id: loaner,
  }));

  return ships_loaners;
}

// Function to get a array of variants for a ship
async function getVariants(
  shipData: any,
  liveShipList: any[],
  flShipList: any[],
): Promise<{ ship_id: string; variant_id: string }[]> {
  const getFlData = () =>
    flShipList.find((ship) => ship.id === shipData.fl_id) || {};

  const flData = getFlData();

  if (
    !flData ||
    flData === undefined ||
    flData === 'undefined' ||
    !flData.slug ||
    flData.slug === undefined
  )
    return null;

  const flVariants = await fetchFlShipVariants(flData.slug);

  const variants = flVariants?.map(
    (variant: { id: string }) =>
      liveShipList.find((ship) => ship.fl_id === variant.id)?.id,
  );

  const ships_variants = variants?.map((variant: string) => ({
    ship_id: shipData.id,
    variant_id: variant,
  }));

  return ships_variants;
}

async function createLoaners(loaners: any, token: string): Promise<any> {
  const flattenedLoaners = loaners.flat();

  try {
    const { data: old_loaners } = await axios.get(
      `${cms_url}items/ships_loaners?limit=-1&fields=id`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (old_loaners.data.length > 0) {
      const { data: deleted_loaners } = await axios.delete(
        `${cms_url}items/ships_loaners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: old_loaners.data.map((loaner) => loaner.id),
        },
      );
    }

    // const {data: created_loaners} = await Promise.all(
    //   flattenedLoaners.map(async (loaner) => {
    //     return await axios.post(`${cms_url}items/ships_loaners`, loaner, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //   }),
    // );
    const created_loaners = await Promise.all(
      flattenedLoaners.map(async (loaner) => {
        const { data } = await axios.post(
          `${cms_url}items/ships_loaners`,
          loaner,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return data;
      }),
    );

    return created_loaners;
  } catch (e) {
    console.error('Error creating loaners:', e);
  }
}

async function createVariants(variants: any, token: string): Promise<any> {
  const flattenedVariants = variants.flat();

  try {
    const { data: old_variants } = await axios.get(
      `${cms_url}items/ships_variants?limit=-1&fields=id`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (old_variants.data.length > 0) {
      const { data: deleted_variants } = await axios.delete(
        `${cms_url}items/ships_variants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: old_variants.data.map((variant) => variant.id),
        },
      );
    }
    const created_variants = await Promise.all(
      flattenedVariants.map(async (variant) => {
        const { data } = await axios.post(
          `${cms_url}items/ships_variants`,
          variant,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return data;
      }),
    );

    return created_variants;
  } catch (e) {
    console.error('Error creating variants:', e);
  }
}

@Controller('shipapi/update/next')
@UseInterceptors(TimeoutInterceptor) // 👈 Apply the TimeoutInterceptor to set a 150 minutes timeout.
export class NextController {
  @Post()
  async postUpdate(@Headers() headers) {
    const token = headers['cms-token'];

    if (!token) throw new HttpException('Directus token not provided', 400);

    // Fetch the ship list from cms_url
    const liveShipList = await fetchLiveShipList();

    // Fetch the ship list from fl_url
    const flShipList = await fetchFlShipList();

    // Create loaners array
    const loaners = await Promise.all(
      liveShipList.map(
        async (shipData: any) =>
          await getLoaners(shipData, liveShipList, flShipList),
      ),
    ).then((loaners) => loaners.flat());

    // Create variants array
    const variants = await Promise.all(
      liveShipList.map(
        async (shipData: any) =>
          await getVariants(shipData, liveShipList, flShipList),
      ),
    ).then((variants) => variants.flat());

    const created_loaners = await createLoaners(loaners, token);
    const created_variants = await createVariants(variants, token);

    return { created_loaners, created_variants };

    // return await updateOrCreateShips(ships, shipList, token);
  }

  @Get()
  async getUpdate() {
    // Fetch the ship list from cms_url
    const liveShipList = await fetchLiveShipList();

    // Fetch the ship list from fl_url
    const flShipList = await fetchFlShipList();

    // Create loaners array
    const loaners = await Promise.all(
      liveShipList.map(
        async (shipData: any) =>
          await getLoaners(shipData, liveShipList, flShipList),
      ),
    ).then((loaners) => loaners.flat());

    // Create variants array
    const variants = await Promise.all(
      liveShipList.map(
        async (shipData: any) =>
          await getVariants(shipData, liveShipList, flShipList),
      ),
    ).then((variants) => variants.flat());

    return { loaners, variants };
  }
}
