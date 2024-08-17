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
import {
  createDirectus,
  staticToken,
  rest,
  readItems,
  createItems,
  updateItem,
} from '@directus/sdk';
import type p4kShip from './p4kShip.type';

const sm_url = 'https://robertsspaceindustries.com/ship-matrix/index';
const fl_url = 'https://api.fleetyards.net/v1/';
const p4k_url = 'https://p4k.ariscorp.de/';
const p4k_version_url = 'https://p4k.ariscorp.de/version.txt';
const cms_url = 'https://cms.ariscorp.de/';

const skippedShips = [
  'Anvil Ballista Snowblind',
  'Anvil Ballista Dunestalker',
  'Anvil Ballista Dunestalker',
  'Carrack w/C8X',
  'Carrack Expedition w/C8X',
  'Carrack Expedition',
  'Cutlass Black Best In Show Edition',
  'Carrack Expedition',
  'Constellation Phoenix Emerald',
  'Caterpillar Pirate Edition',
  'Caterpillar Best In Show Edition',
  'Hammerhead Best In Show Edition',
  'Reclaimer Best In Show Edition',
  'Valkyrie Liberator Edition',
  'Argo Mole Carbon Edition',
  'Argo Mole Talus Edition',
  'Nautilus Solstice Edition',
  'Mustang Alpha Vindicator',
  'P-72 Archimedes Emerald',
  '',
];

// SM Types
interface smCompiled {
  RSIAvionic: {
    radar: smComponent[];
    computers: smComponent[];
  };
  RSIPropulsion: {
    fuel_intakes: smComponent[];
    fuel_tanks: smComponent[];
    quantum_drives: smComponent[];
    jump_modules: smComponent[];
    quantum_fuel_tanks: smComponent[];
  };
  RSIThruster: {
    main_thrusters: smComponent[];
    maneuvering_thrusters: smComponent[];
  };
  RSIModular: {
    power_plants: smComponent[];
    coolers: smComponent[];
    shield_generators: smComponent[];
  };
  RSIWeapon: {
    weapons: smComponent[];
    turrets: any[];
    missiles: smComponent[];
    utility_items: any[];
  };
}
interface smComponent {
  type: string;
  name: string;
  mounts: string;
  component_size: string;
  size: string;
  details: string;
  quantity: string;
  manufacturer: string | null;
  component_class: string;
  category?: string;
}
interface smShip {
  id: string;
  afterburner_speed: number;
  beam: number;
  cargocapacity: null;
  chassis_id: number;
  height: number;
  length: number;
  manufacturer_id: number;
  mass: number;
  max_crew: number;
  min_crew: number;
  pitch_max: null;
  production_note: null;
  production_status: string;
  roll_max: null;
  scm_speed: number;
  size: string;
  time_modified: string;
  type: string;
  xaxis_acceleration: null;
  yaw_max: null;
  yaxis_acceleration: null;
  zaxis_acceleration: null;
  description: string;
  focus: string;
  name: string;
  url: string;
  manufacturer: {
    id: number;
    code: string;
    description: string;
    known_for: string;
    name: string;
    media: any[];
  };
  media: any[];
  time_modified_unfiltered: string;
  compiled: smCompiled;
}

// CMS Types
interface cmsFuelTank {
  size: number;
  capacity: number;
}
interface cmsThruster {
  size: number;
  grade: number;
  manufacturer: string;
}
interface cmsCompany {
  id?: string;
  code?: string;
  name?: string;
}
interface cmsPowerplant {
  name: string;
  grade: number;
  size: number;
  class_name: string;
  manufacturer: string;
}
interface cmsCooler {
  name: string;
  grade: number;
  size: number;
  class_name: string;
  manufacturer: string;
}
interface cmsShield {
  name: string;
  grade: number;
  size: number;
  class_name: string;
  manufacturer: string;
}
interface cmsQd {
  name: string;
  grade: number;
  size: number;
  class_name: string;
  manufacturer: string;
}
interface cmsHardpoint {
  size: number;
  gimbaled: boolean;
  name: string;
  class_name: string;
  manufacturer: string;
}
interface cmsTurretHardpoint {
  size: number;
  name: string;
  class_name: string;
  manufacturer: string;
}
interface cmsShip {
  id?: string;
  status?: string;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  name?: string;
  slug?: string;
  p4k_mode?: boolean;
  p4k_id?: string;
  p4k_name?: string;
  p4k_version?: string;
  manufacturer?: string;
  store_url?: string;
  sales_url?: string;
  erkul_id?: string;
  fl_id?: string;
  pledge_price?: string;
  price?: string;
  on_sale?: boolean;
  production_note?: string | null;
  live_patch?: string | null;
  tank_size_hydrogen?: number | null;
  tank_size_quantum?: number | null;
  crew_min?: number;
  crew_max?: string;
  speed_max?: number;
  speed_scm?: number;
  zero_to_scm?: number;
  zero_to_max?: number;
  scm_to_zero?: number;
  max_to_zero?: number;
  brochure?: string | null;
  hologram?: string | null;
  size?: number;
  size_label?: string | null;
  insurance_claim_time?: string;
  insurance_expedited_cost?: string;
  insurance_expedited_time?: string;
  store_image?: string;
  commercial_video_id?: string;
  ground?: boolean;
  description?: string;
  history?: string;
  rating?: string;
  production_status?: string;
  field_overwrite?: string[];
  ownable?: boolean | null;
  classification?: string | null;
  focuses?: string[] | null;
  pilot_hardpoints?: cmsHardpoint[] | null;
  remote_turrets?: cmsTurretHardpoint[] | null;
  manned_turrets?: cmsTurretHardpoint[] | null;
  shields?: cmsShield[] | null;
  coolers?: cmsCooler[] | null;
  quantum_drives?: cmsQd[] | null;
  power_plants?: cmsPowerplant[] | null;
  quantum_fuel_tanks?: cmsFuelTank[];
  hydrogen_fuel_tanks?: cmsFuelTank[];
  main_thrusters?: cmsThruster[] | null;
  retro_thrusters?: cmsThruster[] | null;
  vtol_thrusters?: cmsThruster[] | null;
  maneuvering_thrusters?: cmsThruster[] | null;
  mass?: number;
  length?: number;
  beam?: number;
  height?: number;
  gravlev?: boolean;
  acceleration_main?: number | null;
  acceleration_retro?: number | null;
  acceleration_vtol?: number | null;
  acceleration_maneuvering?: number | null;
  pitch?: number;
  roll?: number;
  yaw?: number;
  sm_id?: number;
  cargo?: number;
  commercial?: boolean | null;
  user_wishlists?: number[];
  user_hangars?: number[];
  commercials?: number[];
  modules?: number[];
  gallery?: number[];
  paints?: number[];
  loaners?: number[];
  variants?: number[];
}

interface flShip {
  id?: string;
  scIdentifier?: string;
  name?: string;
  slug?: string;
  availability?: {
    listedAt?: string[];
    boughtAt?: string[];
    soldAt?: string[];
    rentalAt?: string[];
  };
  brochure?: string;
  classification?: string;
  classificationLabel?: string;
  crew?: {
    max?: number;
    maxLabel?: string;
    min?: number;
    minLabel?: string;
  };
  description?: string;
  erkulIdentifier?: string;
  focus?: string;
  hasImages?: boolean;
  hasModules?: boolean;
  hasPaints?: boolean;
  hasUpgrades?: boolean;
  hasVideos?: boolean;
  holo?: string;
  holoColored?: boolean;
  lastPledgePrice?: number;
  lastPledgePriceLabel?: string;
  lastUpdatedAt?: string;
  lastUpdatedAtLabel?: string;
  links?: {
    storeUrl?: string;
    salesPageUrl?: string;
    self?: string;
    frontend?: string;
  };
  loaners?: flShip[];
  variants?: flShip[];
  modules?: flModule[];
  paints?: flPaint[];
  manufacturer?: {
    name?: string;
    longName?: string;
    slug?: string;
    code?: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  media?: any;
  metrics?: {
    beam?: number;
    beamLabel?: string;
    cargo?: number;
    cargoLabel?: string;
    fleetchartLength?: number;
    height?: number;
    heightLabel?: string;
    isGroundVehicle?: boolean;
    length?: number;
    lengthLabel?: string;
    mass?: number;
    massLabel?: string;
    size?: string;
    sizeLabel?: string;
  };
  onSale?: boolean;
  pledgePrice?: number;
  pledgePriceLabel?: string;
  productionStatus?: string;
  rsiId?: number;
  rsiName?: string;
  rsiSlug?: string;
  speeds?: Record<string, unknown>;
  dockCounts?: {
    size?: string;
    count?: number;
    type?: string;
    typeLabel?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  angledView?: string;
  angledViewHeight?: number;
  angledViewLarge?: string;
  angledViewMedium?: string;
  angledViewSmall?: string;
  angledViewWidth?: number;
  angledViewXlarge?: string;
  fleetchartImage?: string;
  maxCrew?: number;
  maxCrewLabel?: string;
  minCrew?: number;
  minCrewLabel?: string;
  storeImage?: string;
}
interface flModule {
  id?: string;
  name?: string;
  availability?: {
    boughtAt?: string[];
    soldAt?: string[];
  };
  description?: string;
  hasStoreImage?: boolean;
  media?: {
    storeImage?: {
      source?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
  };
  productionStatus?: string;
  storeImage?: string;
  storeImageLarge?: string;
  storeImageMedium?: string;
  storeImageSmall?: string;
  manufacturer?: {
    name?: string;
    longName?: string;
    slug?: string;
    code?: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
interface flPaint {
  id?: string;
  name?: string;
  slug?: string;
  availability?: {
    boughtAt?: string[];
    soldAt?: string[];
  };
  description?: string;
  media?: {
    storeImage?: {
      source?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
  };
  nameWithModel?: string;
  createdAt?: string;
  updatedAt?: string;
  hasStoreImage?: boolean;
  storeImage?: string;
  storeImageLarge?: string;
  storeImageMedium?: string;
  storeImageSmall?: string;
}

// Update Types
interface updatedShip {
  id: string;
  sm_id: string;
  updatedProps: updatedProps;
}
interface updatedProps {
  [key: string]: { old: any; new: any };
}

// Helper functions
function httpError(status, message) {
  console.error(`${status}: ${message}`);
  throw new HttpException(message, status);
}
function convertLongSizes(size: string): number {
  switch (size) {
    case 'small':
      return 1;
    case 'medium':
      return 2;
    case 'large':
      return 3;
    case 'capital':
      return 4;
    default:
      return 0;
  }
}
function convertSize(size: string): number {
  switch (size) {
    case 'S':
      return 1;
    case 'M':
      return 2;
    case 'L':
      return 3;
    case 'XL':
      return 4;
    default:
      return 0;
  }
}

// Get data from CMS
async function getCMSShips(): Promise<cmsShip[]> {
  try {
    const client = createDirectus<{ ships: cmsShip[] }>(cms_url).with(rest());
    const results = await client.request(
      readItems('ships', {
        limit: -1,
      }),
    );

    return results;
  } catch (error) {
    httpError(500, 'CMS API not available');
  }
}

// Get data from Star Citizen Ship Matrix
async function getSMShips(): Promise<any> {
  try {
    const smShips = [];
    const response = await axios.get(sm_url);
    response.data?.data.forEach((ship) => {
      if (skippedShips.includes(ship.name)) return;
      smShips.push(ship);
    });

    return smShips.sort((a, b) => {
      if (a.manufacturer.code !== b.manufacturer.code) {
        return a.manufacturer.code.localeCompare(b.manufacturer.code);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  } catch (error) {
    httpError(500, 'Star Citizen Ship Matrix not available');
  }
}

async function getFlShip(id: string | number): Promise<flShip> {
  try {
    const ships = await axios.get(fl_url + 'models?page=1&perPage=240');
    const flShip = ships.data.find((ship) => String(ship.rsiId) === String(id));
    const flData = await axios.get(fl_url + 'models/' + flShip.slug);
    const flVariants = await axios.get(
      fl_url + 'models/' + flShip.slug + '/variants',
    );
    const flLoaners = await axios.get(
      fl_url + 'models/' + flShip.slug + '/loaners',
    );
    const flModules = await axios.get(
      fl_url + 'models/' + flShip.slug + '/modules',
    );
    const flPaints = await axios.get(
      fl_url + 'models/' + flShip.slug + '/paints',
    );

    return {
      ...flData.data,
      variants: flVariants.data,
      loaners: flLoaners.data,
      modules: flModules.data,
      paints: flPaints.data,
    };
  } catch (error) {
    console.log(error);
    httpError(500, 'Fleetyards API not available');
  }
}

async function getP4kShip(smShip: smShip): Promise<p4kShip> {
  // const maxRetries = 3;
  // let attempt = 0;
  // while (attempt < maxRetries) {
  try {
    const p4kId = `${smShip.manufacturer.code === 'MRAI' ? 'MISC' : smShip.manufacturer.code}_${smShip.name
      .trim()
      .replace(' Kore', '')
      .replace(' w/C8X', '')
      .replace(' MK I', '')
      .replace('Mercury', 'Star Runner')
      .replace('C1 Spirit', 'Spirit C1')
      .replace('E1 Spirit', 'Spirit E1')
      .replace('A1 Spirit', 'Spirit A1')
      .replace('890 Jump', '890Jump')
      .replace('Ursa', 'Ursa Rover')
      .replace('Ursa', 'Ursa Rover')
      .replace(/ /g, '_')
      .replace(/P-/g, 'P')
      .replace(/-/g, '_')}`;

    let p4kIdModified = p4kId.toLowerCase();
    if (smShip.name.toLowerCase().includes('f7')) {
      p4kIdModified = p4kIdModified
        .replace('anvl_', 'ANVL_HORNET_')
        .replace('hornet_', '_')
        .replace('mk_ii', '')
        .replace('mk_i', '')
        .replace('f7c_', 'f7c')
        .replace('heartseeker', '')
        .replace('super', '')
        .replace('wildfire', '')
        .replace('tracker', '')
        .replace('ghost', '')
        .replace(/_+/g, '_')
        .replace(/_$/, '');

      if (
        smShip.name.toLowerCase() === 'f7c hornet mk ii' ||
        smShip.name.toLowerCase() === 'f7a hornet mk ii'
      ) {
        p4kIdModified = p4kIdModified + '_mk2';
      }

      if (smShip.name.toLowerCase() === 'f7a hornet mk i') {
        p4kIdModified = p4kIdModified + '_mk1';
      }

      p4kIdModified = p4kIdModified.toUpperCase();
    }

    const p4kShips = await axios.get(p4k_url + 'ships.json');
    const p4kShip = p4kShips.data.find(
      (ship: p4kShip) =>
        ship.ClassName?.toLowerCase() === p4kIdModified.toLowerCase(),
    );
    if (!p4kShip?.ClassName) return;
    const p4kPorts = await axios.get(
      p4k_url + 'ships/' + p4kShip.ClassName?.toLowerCase() + '-ports.json',
    );

    if (p4kPorts.data === '404: Not Found') return;

    return {
      ...p4kShip,
      ...p4kPorts.data,
    };
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   if (error.code === 'ECONNRESET') {
    //     console.error(
    //       `Connection was reset. Attempt ${attempt + 1} of ${maxRetries}`,
    //     );
    //     attempt++;
    //     if (attempt >= maxRetries) {
    //       httpError(500, 'P4K API not available after multiple attempts');
    //     }
    //   } else {
    //     console.error('Axios error:', error.message);
    //     httpError(500, 'P4K API not available');
    //   }
    // } else {
    console.error('Unexpected error:', error);
    httpError(500, 'P4K API not available');
    // }
    // console.log(error);

    // httpError(500, 'P4K API not available');
  }
  // }
}

async function getManufacturerId(manufacturerData: {
  name?: string;
  code?: string;
  Name?: string;
  Code?: string;
}): Promise<string> {
  try {
    if (!manufacturerData) return;

    const client = createDirectus<{ companies: cmsCompany[] }>(cms_url).with(
      rest(),
    );
    const results = await client.request(
      readItems('companies', {
        fields: ['id'],
        filter: {
          _or: [
            ...(manufacturerData.name
              ? [{ name: { _icontains: manufacturerData.name } }]
              : []),
            ...(manufacturerData.code
              ? [{ code: { _icontains: manufacturerData.code } }]
              : []),
            ...(manufacturerData.Name
              ? [{ name: { _icontains: manufacturerData.Name } }]
              : []),
            ...(manufacturerData.Code
              ? [{ code: { _icontains: manufacturerData.Code } }]
              : []),
          ],
        },
        limit: 1,
      }),
    );

    return results[0].id;
  } catch (error) {
    console.error(error);
    httpError(500, 'CMS API not available');
  }
}

// Form ship data
async function formShipData(
  smShip: smShip,
  flShip: flShip,
  p4kShip: any | null,
  cmsShip?: cmsShip,
  newData?: updatedShip,
): Promise<cmsShip> {
  // Check if all data is available
  if (!smShip)
    httpError(
      500,
      'Cannot form ship data without Star Citizen Ship Matrix data',
    );
  if (!flShip) httpError(500, 'Cannot form ship data without Fleetyards data');

  const manufacturerId = await getManufacturerId(smShip.manufacturer);

  // Get Hydrogen Tanks
  function getHydrogenTanks() {
    const hydrogen_tanks: cmsFuelTank[] = [];

    if (p4kShip) {
      p4kShip.HydrogenFuelTanks.forEach((tank) => {
        const data: cmsFuelTank = {
          size: tank.InstalledItem?.Size,
          capacity: tank.InstalledItem?.HydrogenFuelTank.Capacity,
        };
        hydrogen_tanks.push(data);
      });
    } else {
      smShip.compiled.RSIPropulsion.fuel_tanks.forEach((tankType) => {
        Array.from({ length: Number(tankType.mounts) }).forEach(() => {
          const data: cmsFuelTank = {
            size: convertSize(tankType.size),
            capacity: 0,
          };
          hydrogen_tanks.push(data);
        });
      });
    }

    return hydrogen_tanks;
  }

  // Get Quantum Tanks
  function getQuantumTanks() {
    const quantum_tanks: cmsFuelTank[] = [];
    if (p4kShip) {
      p4kShip.QuantumFuelTanks.forEach((tank) => {
        const data: cmsFuelTank = {
          size: tank.InstalledItem?.Size,
          capacity: tank.InstalledItem?.QuantumFuelTank.Capacity,
        };
        quantum_tanks.push(data);
      });
    } else {
      smShip.compiled.RSIPropulsion.quantum_fuel_tanks.forEach((tankType) => {
        Array.from({ length: Number(tankType.mounts) }).forEach(() => {
          const data: cmsFuelTank = {
            size: convertSize(tankType.size),
            capacity: 0,
          };
          quantum_tanks.push(data);
        });
      });
    }

    return quantum_tanks;
  }

  // Get Main Thrusters
  async function getMainThrusters() {
    const thrusters: cmsThruster[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.MainThrusters.map(async (thruster) => {
          const data: cmsThruster = {
            size: thruster.InstalledItem?.Size,
            grade: thruster.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              thruster.InstalledItem?.Manufacturer,
            ),
          };
          thrusters.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIThruster.main_thrusters.forEach((thrusterType) => {
        Array.from({ length: Number(thrusterType.mounts) }).forEach(() => {
          const data: cmsThruster = {
            size: convertSize(thrusterType.component_size),
            grade: 0,
            manufacturer: manufacturerId,
          };
          thrusters.push(data);
        });
      });
    }

    return thrusters;
  }

  // Get Retro Thrusters
  async function getRetroThrusters() {
    const thrusters: cmsThruster[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.RetroThrusters.map(async (thruster) => {
          const data: cmsThruster = {
            size: thruster.InstalledItem?.Size,
            grade: thruster.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              thruster.InstalledItem?.Manufacturer,
            ),
          };
          thrusters.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIThruster.maneuvering_thrusters
        .filter((thruster) => thruster.name?.toLowerCase()?.includes('retro'))
        .forEach((thrusterType) => {
          Array.from({ length: Number(thrusterType.mounts) }).forEach(() => {
            const data: cmsThruster = {
              size: convertSize(thrusterType.component_size),
              grade: 0,
              manufacturer: manufacturerId,
            };
            thrusters.push(data);
          });
        });
    }

    return thrusters;
  }

  // Get VTOL Thrusters
  async function getVtolThrusters() {
    const thrusters: cmsThruster[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.VtolThrusters.map(async (thruster) => {
          const data: cmsThruster = {
            size: thruster.InstalledItem?.Size,
            grade: thruster.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              thruster.InstalledItem?.Manufacturer,
            ),
          };
          thrusters.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIThruster.maneuvering_thrusters
        .filter((thruster) => thruster.name?.toLowerCase()?.includes('vtol'))
        .forEach((thrusterType) => {
          Array.from({ length: Number(thrusterType.mounts) }).forEach(() => {
            const data: cmsThruster = {
              size: convertSize(thrusterType.component_size),
              grade: 0,
              manufacturer: manufacturerId,
            };
            thrusters.push(data);
          });
        });
    }

    return thrusters;
  }

  // Get Maneuvering Thrusters
  async function getManeuveringThrusters() {
    const thrusters: cmsThruster[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.ManeuveringThrusters.map(async (thruster) => {
          const data: cmsThruster = {
            size: thruster.InstalledItem?.Size,
            grade: thruster.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              thruster.InstalledItem?.Manufacturer,
            ),
          };
          thrusters.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIThruster.maneuvering_thrusters
        .filter((thruster) =>
          thruster.name?.toLowerCase()?.includes('maneuvering'),
        )
        .forEach((thrusterType) => {
          Array.from({ length: Number(thrusterType.mounts) }).forEach(() => {
            const data: cmsThruster = {
              size: convertSize(thrusterType.component_size),
              grade: 0,
              manufacturer: manufacturerId,
            };
            thrusters.push(data);
          });
        });
    }

    return thrusters;
  }

  // Get Power Plants
  async function getPowerPlants() {
    const powerplants: cmsPowerplant[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.PowerPlants.map(async (powerplant) => {
          const data: cmsPowerplant = {
            size: powerplant.InstalledItem?.Size,
            grade: powerplant.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              powerplant.InstalledItem?.Manufacturer,
            ),
            name: powerplant.InstalledItem?.Name,
            class_name: powerplant.InstalledItem?.ClassName,
          };
          powerplants.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIModular.power_plants.forEach((powerplantType) => {
        Array.from({ length: Number(powerplantType.mounts) }).forEach(() => {
          const data: cmsPowerplant = {
            size: convertSize(powerplantType.component_size),
            grade: 0,
            manufacturer: manufacturerId,
            name: powerplantType.name,
            class_name: '',
          };
          powerplants.push(data);
        });
      });
    }

    return powerplants;
  }

  // Get Coolers
  async function getCoolers() {
    const coolers: cmsCooler[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.Coolers.map(async (cooler) => {
          const data: cmsPowerplant = {
            size: cooler.InstalledItem?.Size,
            grade: cooler.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              cooler.InstalledItem?.Manufacturer,
            ),
            name: cooler.InstalledItem?.Name,
            class_name: cooler.InstalledItem?.ClassName,
          };
          coolers.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIModular.coolers.forEach((coolerType) => {
        Array.from({ length: Number(coolerType.mounts) }).forEach(() => {
          const data: cmsCooler = {
            size: convertSize(coolerType.component_size),
            grade: 0,
            manufacturer: manufacturerId,
            name: coolerType.name,
            class_name: '',
          };
          coolers.push(data);
        });
      });
    }

    return coolers;
  }

  // Get Shields
  async function getShields() {
    const shields: cmsShield[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.Shields.map(async (shield) => {
          const data: cmsPowerplant = {
            size: shield.InstalledItem?.Size,
            grade: shield.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              shield.InstalledItem?.Manufacturer,
            ),
            name: shield.InstalledItem?.Name,
            class_name: shield.InstalledItem?.ClassName,
          };
          shields.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIModular.shield_generators.forEach((shieldType) => {
        Array.from({ length: Number(shieldType.mounts) }).forEach(() => {
          const data: cmsShield = {
            size: convertSize(shieldType.component_size),
            grade: 0,
            manufacturer: manufacturerId,
            name: shieldType.name,
            class_name: '',
          };
          shields.push(data);
        });
      });
    }

    return shields;
  }

  // Get Quantum Drives
  async function getQD() {
    const qds: cmsQd[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.QuantumDrives.map(async (qd) => {
          const data: cmsQd = {
            size: qd.InstalledItem?.Size,
            grade: qd.InstalledItem?.Grade,
            manufacturer: await getManufacturerId(
              qd.InstalledItem?.Manufacturer,
            ),
            name: qd.InstalledItem?.Name,
            class_name: qd.InstalledItem?.ClassName,
          };
          qds.push(data);
        }),
      );
    }

    return qds;
  }

  // Get Pilot Hardpoints
  async function getPilotHardpoints() {
    const hardpoints: cmsHardpoint[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.PilotHardpoints.map(async (hardpoint) => {
          const data: cmsHardpoint = {
            size: hardpoint.Size,
            gimbaled: true,
            class_name:
              hardpoint.InstalledItem?.ClassName || hardpoint.PortName,
            manufacturer: await getManufacturerId(
              hardpoint.InstalledItem?.Manufacturer,
            ),
            name: hardpoint.InstalledItem?.Name,
          };
          hardpoints.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIWeapon.weapons.forEach((hardpointType) => {
        Array.from({ length: Number(hardpointType.mounts) }).forEach(() => {
          const data: cmsHardpoint = {
            size: Number(hardpointType.component_size),
            gimbaled: true,
            class_name: '',
            manufacturer: '',
            name: hardpointType.name,
          };
          hardpoints.push(data);
        });
      });
      smShip.compiled.RSIWeapon.missiles.forEach((hardpointType) => {
        Array.from({ length: Number(hardpointType.mounts) }).forEach(() => {
          const data: cmsHardpoint = {
            size: Number(hardpointType.component_size),
            gimbaled: true,
            class_name: '',
            manufacturer: '',
            name: hardpointType.name,
          };
          hardpoints.push(data);
        });
      });
    }

    return hardpoints;
  }

  // Get Manned Turrets
  async function getMannedTurrets() {
    const hardpoints: cmsTurretHardpoint[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.MannedTurrets.map(async (hardpoint) => {
          const data: cmsTurretHardpoint = {
            size: hardpoint.Size,
            class_name:
              hardpoint.InstalledItem?.ClassName || hardpoint.PortName,
            manufacturer: await getManufacturerId(
              hardpoint.InstalledItem?.Manufacturer,
            ),
            name: hardpoint.InstalledItem?.Name,
          };
          hardpoints.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIWeapon.turrets
        .filter((turret) => turret.details.toLowerCase().includes('manned'))
        .forEach((hardpointType) => {
          Array.from({ length: Number(hardpointType.mounts) }).forEach(() => {
            const data: cmsTurretHardpoint = {
              size: Number(hardpointType.component_size),
              class_name: '',
              manufacturer: '',
              name: hardpointType.name,
            };
            hardpoints.push(data);
          });
        });
    }

    return hardpoints;
  }

  // Get Remote Turrets
  async function getRemoteTurrets() {
    const hardpoints: cmsTurretHardpoint[] = [];
    if (p4kShip) {
      await Promise.all(
        p4kShip.RemoteTurrets.map(async (hardpoint) => {
          const data: cmsTurretHardpoint = {
            size: hardpoint.Size,
            class_name:
              hardpoint.InstalledItem?.ClassName || hardpoint.PortName,
            manufacturer: await getManufacturerId(
              hardpoint.InstalledItem?.Manufacturer,
            ),
            name: hardpoint.InstalledItem?.Name,
          };
          hardpoints.push(data);
        }),
      );
    } else {
      smShip.compiled.RSIWeapon.turrets
        .filter((turret) => turret.details.toLowerCase().includes('remote'))
        .forEach((hardpointType) => {
          Array.from({ length: Number(hardpointType.mounts) }).forEach(() => {
            const data: cmsTurretHardpoint = {
              size: Number(hardpointType.component_size),
              class_name: '',
              manufacturer: '',
              name: hardpointType.name,
            };
            hardpoints.push(data);
          });
        });
    }

    return hardpoints;
  }
  if (p4kShip && !p4kShip.Size) console.log(smShip.name);
  if (!newData) {
    const shipData: cmsShip = {
      name: smShip.name?.trim(),
      p4k_mode: p4kShip ? true : false,
      p4k_id: p4kShip ? p4kShip.ClassName : null,
      p4k_name: p4kShip ? p4kShip.Name : null,
      p4k_version: p4kShip ? p4kShip.p4kVersion : null,
      manufacturer: manufacturerId,
      store_url: flShip.links.storeUrl,
      sales_url: flShip.links.salesPageUrl,
      erkul_id: flShip.erkulIdentifier,
      fl_id: flShip.id,
      pledge_price: flShip.pledgePrice ? String(flShip.pledgePrice) : null,
      price: flShip.lastPledgePrice ? String(flShip.lastPledgePrice) : null,
      on_sale: flShip.onSale,
      // tank_size_hydrogen
      // tank_size_quantum
      crew_min: isFinite(p4kShip ? p4kShip.WeaponCrew : smShip.min_crew)
        ? p4kShip
          ? p4kShip.WeaponCrew || null
          : smShip.min_crew || null
        : null,
      crew_max: isFinite(p4kShip ? p4kShip.Crew : smShip.max_crew)
        ? p4kShip
          ? p4kShip.Crew || null
          : smShip.max_crew || null
        : null,
      speed_max: isFinite(
        p4kShip
          ? p4kShip.FlightCharacteristics?.MaxSpeed || null
          : smShip.afterburner_speed || null,
      )
        ? p4kShip
          ? Math.round(p4kShip.FlightCharacteristics?.MaxSpeed) || null
          : Math.round(smShip.afterburner_speed) || null
        : null,
      speed_scm: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.ScmSpeed : smShip.scm_speed,
      )
        ? p4kShip
          ? Math.round(p4kShip.FlightCharacteristics?.ScmSpeed) || null
          : Math.round(smShip.scm_speed)
        : null,
      zero_to_scm: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.ZeroToScm : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.ZeroToScm || null
          : null
        : null,
      zero_to_max: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.ZeroToMax : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.ZeroToMax || null
          : null
        : null,
      scm_to_zero: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.ScmToZero : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.ScmToZero || null
          : null
        : null,
      max_to_zero: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.MaxToZero : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.MaxToZero || null
          : null
        : null,
      size: p4kShip ? p4kShip.Size : convertLongSizes(smShip.size),
      insurance_claim_time: isFinite(
        p4kShip ? p4kShip.Insurance?.StandardClaimTime : null,
      )
        ? p4kShip
          ? p4kShip.Insurance?.StandardClaimTime || null
          : null
        : null,
      insurance_expedited_cost: isFinite(
        p4kShip ? p4kShip.Insurance?.ExpeditedCost : null,
      )
        ? p4kShip
          ? p4kShip.Insurance?.ExpeditedCost || null
          : null
        : null,
      insurance_expedited_time: isFinite(
        p4kShip ? p4kShip.Insurance?.ExpeditedClaimTime : null,
      )
        ? p4kShip
          ? p4kShip.Insurance?.ExpeditedClaimTime || null
          : null
        : null,
      ground: p4kShip ? p4kShip.IsVehicle : null,
      gravlev: p4kShip ? p4kShip.IsGravlev : null,
      production_status: p4kShip ? 'flight-ready' : flShip.productionStatus,
      // classification
      // focuses
      pilot_hardpoints: await getPilotHardpoints(),
      manned_turrets: await getMannedTurrets(),
      remote_turrets: await getRemoteTurrets(),
      quantum_drives: await getQD(),
      shields: await getShields(),
      coolers: await getCoolers(),
      power_plants: await getPowerPlants(),
      quantum_fuel_tanks: getQuantumTanks(),
      hydrogen_fuel_tanks: getHydrogenTanks(),
      main_thrusters: await getMainThrusters(),
      retro_thrusters: await getRetroThrusters(),
      vtol_thrusters: await getVtolThrusters(),
      maneuvering_thrusters: await getManeuveringThrusters(),
      mass: isFinite(p4kShip ? p4kShip.Mass : smShip.mass)
        ? p4kShip
          ? p4kShip.Mass || null
          : smShip.mass || null
        : null,
      length: isFinite(p4kShip ? p4kShip.Length : smShip.length)
        ? p4kShip
          ? p4kShip.Length || null
          : smShip.length || null
        : null,
      beam: isFinite(p4kShip ? p4kShip.Beam : smShip.beam)
        ? p4kShip
          ? p4kShip.Beam || null
          : smShip.beam || null
        : null,
      height: isFinite(p4kShip ? p4kShip.Height : smShip.height)
        ? p4kShip
          ? p4kShip.Height || null
          : smShip.height || null
        : null,
      acceleration_main: isFinite(
        p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Main || null
          : smShip.xaxis_acceleration || null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Main || null
          : smShip.xaxis_acceleration || null
        : null,
      acceleration_retro: isFinite(
        p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Retro || null
          : smShip.yaxis_acceleration || null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Retro || null
          : smShip.yaxis_acceleration || null
        : null,
      acceleration_vtol: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.Acceleration.Vtol : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Vtol || null
          : null
        : null,
      acceleration_maneuvering: isFinite(
        p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Maneuvering || null
          : null,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Acceleration.Maneuvering || null
          : null
        : null,
      pitch: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.Pitch : smShip.pitch_max,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Pitch || null
          : smShip.pitch_max || null
        : null,
      roll: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.Roll : smShip.roll_max,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Roll || null
          : smShip.roll_max || null
        : null,
      yaw: isFinite(
        p4kShip ? p4kShip.FlightCharacteristics?.Yaw : smShip.yaw_max,
      )
        ? p4kShip
          ? p4kShip.FlightCharacteristics?.Yaw || null
          : smShip.yaw_max || null
        : null,
      sm_id: Number(smShip.id),
      cargo: smShip.cargocapacity,
      // modules
      // gallery
      // paints
      // loaners
      // variants
      // brochure
      // hologram
      // store_image
    };

    return shipData;
  } else {
    const shipData: cmsShip = {
      id: cmsShip.id,
    };

    for (const prop in newData.updatedProps) {
      if (cmsShip.field_overwrite.includes(prop)) continue;
      shipData[prop] = newData.updatedProps[prop].new;
    }

    return shipData;
  }
}

// Get new ships
async function getNewShips(cmsShips: cmsShip[], smShips: smShip[]) {
  try {
    const newShips = smShips.filter(
      (smShip) =>
        !cmsShips.some(
          (cmsShip) => String(cmsShip.sm_id) === String(smShip.id),
        ),
    );
    const p4kVersion = await axios.get(p4k_version_url);

    // Form ship data
    const shipData = await Promise.all(
      newShips.map(async (smShip, index) => {
        if (index > 8) return;
        try {
          const flShip = await getFlShip(smShip.id);
          const p4kShip = await getP4kShip(smShip);
          if (p4kShip) p4kShip.p4kVersion = p4kVersion.data?.trim();

          return await formShipData(smShip, flShip, p4kShip);
        } catch (error) {
          console.error(error);
          httpError(500, 'Cannot get creation Ship Data for: ' + smShip.id);
        }
      }),
    );

    return shipData.filter((ship) => ship);
  } catch (error) {
    httpError(500, 'Cannot get new Ships');
  }
}

// Get all ships with new data
async function getUpdatedShips(
  cmsShips: cmsShip[],
  smShips: smShip[],
): Promise<{ updatedShips: updatedShip[]; shipData: cmsShip[] }> {
  try {
    const shipList = smShips.filter((smShip) =>
      cmsShips.some((cmsShip) => String(cmsShip.sm_id) === String(smShip.id)),
    );

    // Form updated ships
    const updatedShips: updatedShip[] = [];

    await Promise.all(
      shipList.map(async (smShip) => {
        const cmsShip = cmsShips.find(
          (ship) => String(ship.sm_id) === String(smShip.id),
        );

        if (!cmsShip) return;

        const p4kShip = await getP4kShip(smShip);
        const flShip = await getFlShip(smShip.id);
        // console.log(p4kShip);
        const shipData = await formShipData(smShip, flShip, p4kShip);

        const updatedProps: updatedProps = {};

        // Check if any property in smShip is different from cmsShip
        for (const prop in shipData) {
          if (prop === 'id') continue;
          if (shipData[prop] !== cmsShip[prop]) {
            updatedProps[prop] = {
              old: cmsShip[prop],
              new: shipData[prop],
            };
          }
        }

        // If there are updated properties, add ship to updatedShips array
        if (Object.keys(updatedProps).length > 0) {
          updatedShips.push({
            id: cmsShip.id,
            sm_id: smShip.id,
            updatedProps,
          });
        }
      }),
    );

    // Form ship data
    const p4kVersion = await axios.get(p4k_version_url);
    const shipData = await Promise.all(
      updatedShips.map(async (updatedShipData) => {
        try {
          const smShip = smShips.find(
            (ship) => ship.id === updatedShipData.sm_id,
          );
          const cmsShip = cmsShips.find(
            (ship) => String(ship.sm_id) === String(smShip.id),
          );
          const flShip = await getFlShip(smShip.id);
          const p4kShip = await getP4kShip(smShip);
          if (p4kShip) p4kShip.p4kVersion = p4kVersion.data?.trim();

          return await formShipData(
            smShip,
            flShip,
            p4kShip,
            cmsShip,
            updatedShipData,
          );
        } catch (error) {
          httpError(
            500,
            'Cannot get updated Ship Data for: ' + updatedShipData.id,
          );
        }
      }),
    );

    return { updatedShips, shipData };
  } catch (error) {
    console.log(error);

    httpError(500, 'Cannot get updated Ships');
  }
}

// Create ships in CMS
async function createCMSShips(token: string, newShips: cmsShip[]) {
  try {
    const client = createDirectus<{ ships: cmsShip[] }>(cms_url)
      .with(staticToken(token))
      .with(rest());

    return await client.request(createItems('ships', newShips));
  } catch (error) {
    httpError(500, 'Cannot create ships in CMS');
  }
}

// Update ships in CMS
async function updateCMSShips(token: string, updatedShips: cmsShip[]) {
  try {
    const client = createDirectus<{ ships: cmsShip[] }>(cms_url)
      .with(staticToken(token))
      .with(rest());

    // const ids: string[] = updatedShips.map((ship) => ship.id);
    // const ships: cmsShip[] = updatedShips
    //   .map((ship) => {
    //     const obj = ship;
    //     return obj;
    //   })
    //   .filter((ship) => ship);

    const updatedShipsData = [];
    await Promise.all(
      updatedShips.map(async (ship) => {
        const updatedShipData = await client.request(
          updateItem('ships', ship.id, ship),
        );
        return updatedShipsData.push(updatedShipData);
      }),
    );

    return updatedShipsData;
  } catch (error) {
    console.log(error);
    httpError(500, error);
  }
}

// Form updated ships
function formUpdatedShips(updatedShips: updatedShip[], smShips: smShip[]) {
  const formedUpdatedShips = {};

  updatedShips.forEach((ship) => {
    const smShip = smShips.find((s) => s.id === ship.sm_id);
    const manufacturer = smShip.manufacturer.code;
    const shipName = smShip.name;
    const updatedProps = ship.updatedProps;

    formedUpdatedShips[manufacturer + '_' + shipName.replace(/ /g, '')] =
      updatedProps;
  });

  return Object.keys(formedUpdatedShips)
    .sort()
    .reduce((sortedShips, key) => {
      sortedShips[key] = formedUpdatedShips[key];
      return sortedShips;
    }, {});
}

// Form created ships
function formCreatedShips(createdShips: cmsShip[], smShips: smShip[]) {
  const formedCreatedShips = {};

  createdShips.forEach((ship) => {
    if (!ship?.sm_id) {
      console.log('no-sm-id:', ship);
    }
    const smShip = smShips.find((s) => String(s.id) === String(ship.sm_id));
    const manufacturer = smShip.manufacturer?.code;
    const shipName = smShip.name;

    formedCreatedShips[manufacturer + '_' + shipName.replace(/ /g, '')] = ship;
  });

  return Object.keys(formedCreatedShips)
    .sort()
    .reduce((sortedShips, key) => {
      sortedShips[key] = formedCreatedShips[key];
      return sortedShips;
    }, {});
}

// Controller
@Controller('shipapi/update')
@UseInterceptors(TimeoutInterceptor) // 👈 Apply the TimeoutInterceptor to set a 150 minutes timeout.
export class UpdateController {
  @Post()
  async postUpdate(@Headers() headers) {
    const token = headers['cms-token'];
    if (!token) httpError(400, 'No token provided');

    const cmsShipList = await getCMSShips();
    const smShipList = await getSMShips();

    const createdShips = await getNewShips(cmsShipList, smShipList);
    const updatedShips = await getUpdatedShips(cmsShipList, smShipList);

    const formedCreatedShips = formCreatedShips(createdShips, smShipList);
    const formedUpdatedShips = formUpdatedShips(
      updatedShips.updatedShips,
      smShipList,
    );

    await createCMSShips(token, createdShips);
    await updateCMSShips(token, updatedShips.shipData);

    return {
      status: 'ok',
      type: 'normal run',
      created: formedCreatedShips,
      updated: formedUpdatedShips,
    };
  }

  @Get()
  async getUpdate() {
    const cmsShipList = await getCMSShips();
    const smShipList = await getSMShips();

    const createdShips = await getNewShips(cmsShipList, smShipList);
    const updatedShips = await getUpdatedShips(cmsShipList, smShipList);

    const formedCreatedShips = formCreatedShips(createdShips, smShipList);
    const formedUpdatedShips = formUpdatedShips(
      updatedShips.updatedShips,
      smShipList,
    );

    return {
      status: 'ok',
      type: 'dry run',
      created: formedCreatedShips,
      updated: formedUpdatedShips,
    };
  }
}
