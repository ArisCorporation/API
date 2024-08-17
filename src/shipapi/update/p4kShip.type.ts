export interface Root {
  ClassName: string;
  Name: string;
  Description: string;
  Career: string;
  Role: string;
  Size: number;
  Cargo: number;
  Inventory: Inventory;
  Crew: number;
  WeaponCrew: number;
  OperationsCrew: number;
  Mass: number;
  Health: number;
  Width: number;
  Height: number;
  Length: number;
  IsSpaceship: boolean;
  Manufacturer: Manufacturer;
  DamageBeforeDestruction: DamageBeforeDestruction;
  DamageBeforeDetach: DamageBeforeDetach;
  FlightCharacteristics: FlightCharacteristics;
  Propulsion: Propulsion;
  QuantumTravel: QuantumTravel;
  PilotHardpoints: PilotHardpoint[];
  MannedTurrets: any[];
  RemoteTurrets: any[];
  Insurance: Insurance;
  MiningTurrets: any[];
  UtilityTurrets: any[];
  MiningHardpoints: any[];
  UtilityHardpoints: any[];
  MissileRacks: any[];
  Countermeasures: Countermeasure[];
  Shields: Shield[];
  PowerPlants: PowerPlant[];
  Coolers: Cooler[];
  QuantumDrives: any[];
  QuantumFuelTanks: QuantumFuelTank[];
  MainThrusters: MainThruster[];
  RetroThrusters: RetroThruster[];
  VtolThrusters: any[];
  ManeuveringThrusters: ManeuveringThruster[];
  HydrogenFuelTanks: HydrogenFuelTank[];
  HydogenFuelIntakes: HydogenFuelIntake[];
  InterdictionHardpoints: any[];
  CargoGrids: any[];
  Avionics: any[];
  p4kVersion?: string;
}

export interface Inventory {
  SCU: number;
  x: number;
  y: number;
  z: number;
  unit: number;
}

export interface Manufacturer {
  Code: string;
  Name: string;
}

export interface DamageBeforeDestruction {}

export interface DamageBeforeDetach {}

export interface FlightCharacteristics {
  ScmSpeed: number;
  MaxSpeed: number;
  ZeroToScm: number;
  ZeroToMax: number;
  ScmToZero: number;
  MaxToZero: number;
  Acceleration: Acceleration;
  AccelerationG: AccelerationG;
  Pitch: number;
  Yaw: number;
  Roll: number;
}

export interface Acceleration {
  Main: string;
  Retro: string;
  Vtol: string;
  Maneuvering: string;
}

export interface AccelerationG {
  Main: string;
  Retro: string;
  Vtol: string;
  Maneuvering: string;
}

export interface Propulsion {
  FuelCapacity: number;
  FuelIntakeRate: number;
  FuelUsage: FuelUsage;
  ThrustCapacity: ThrustCapacity;
  IntakeToMainFuelRatio: number;
  IntakeToTankCapacityRatio: number;
  TimeForIntakesToFillTank: string;
  ManeuveringTimeTillEmpty: number;
}

export interface FuelUsage {
  Main: number;
  Retro: number;
  Vtol: number;
  Maneuvering: number;
}

export interface ThrustCapacity {
  Main: number;
  Retro: number;
  Vtol: number;
  Maneuvering: number;
}

export interface QuantumTravel {
  Speed: number;
  SpoolTime: number;
  FuelCapacity: number;
  Range: number;
  PortOlisarToArcCorpTime: number;
  PortOlisarToArcCorpFuel: number;
  PortOlisarToArcCorpAndBack: number;
}

export interface PilotHardpoint {
  PortName: string;
  Size: number;
  Loadout: string;
  Types: string[];
  Category: string;
  InstalledItem?: InstalledItem;
}

export interface InstalledItem {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  WeaponRegenPool?: WeaponRegenPool;
  Description?: string;
  Manufacturer?: Manufacturer2;
  Tags?: string[];
  DimensionOverrides?: DimensionOverrides;
  Durability?: Durability;
  MissileRack?: MissileRack;
  PowerConnection?: PowerConnection;
  HeatConnection?: HeatConnection;
  Ports?: Port[];
}

export interface WeaponRegenPool {
  RegenFillRate: number;
  AmmoLoad: number;
  RespectsCapacitorAssignments: boolean;
}

export interface Manufacturer2 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides {
  Width: number;
  Height: number;
  Depth: number;
}

export interface Durability {
  Health: number;
}

export interface MissileRack {
  Count: number;
  Size: number;
}

export interface PowerConnection {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface Port {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem2;
  Types: string[];
  Category: string;
}

export interface InstalledItem2 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Description: string;
  Manufacturer: Manufacturer3;
  Tags: string[];
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  DimensionOverrides: DimensionOverrides2;
  Durability: Durability2;
  Missile: Missile;
}

export interface Manufacturer3 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides2 {
  Width: number;
  Height: number;
  Depth: number;
}

export interface Durability2 {
  Health: number;
}

export interface Missile {
  Damage: Damage;
}

export interface Damage {
  Physical: number;
}

export interface Insurance {
  StandardClaimTime: number;
  ExpeditedClaimTime: number;
  ExpeditedCost: number;
}

export interface Countermeasure {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem3;
  Types: string[];
  Category: string;
}

export interface InstalledItem3 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Description: string;
  Manufacturer: Manufacturer4;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  DimensionOverrides: DimensionOverrides3;
  Durability: Durability3;
  PowerConnection: PowerConnection2;
  Weapon: Weapon;
  Ammunition: Ammunition2;
}

export interface Manufacturer4 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides3 {
  Width: number;
  Height: number;
  Depth: number;
}

export interface Durability3 {
  Health: number;
}

export interface PowerConnection2 {
  PowerBase: number;
  PowerDraw: number;
}

export interface Weapon {
  Ammunition: Ammunition;
  Modes: Mode[];
}

export interface Ammunition {
  UUID: string;
  Type: string;
  Speed: number;
  Range: number;
  Size: number;
  Capacity: number;
  ImpactDamage: ImpactDamage;
  BulletImpulseFalloff: BulletImpulseFalloff;
  BulletPierceability: BulletPierceability;
  BulletElectron: BulletElectron;
  DamageDropMinDistance: DamageDropMinDistance;
  DamageDropPerMeter: DamageDropPerMeter;
  DamageDropMinDamage: DamageDropMinDamage;
}

export interface ImpactDamage {}

export interface BulletImpulseFalloff {}

export interface BulletPierceability {}

export interface BulletElectron {}

export interface DamageDropMinDistance {}

export interface DamageDropPerMeter {}

export interface DamageDropMinDamage {}

export interface Mode {
  Name: string;
  LocalisedName: string;
  RoundsPerMinute: number;
  FireType: string;
  AmmoPerShot: number;
  PelletsPerShot: number;
  DamagePerShot: DamagePerShot;
  DamagePerSecond: DamagePerSecond;
}

export interface DamagePerShot {}

export interface DamagePerSecond {}

export interface Ammunition2 {
  UUID: string;
  Type: string;
  Speed: number;
  Range: number;
  Size: number;
  Capacity: number;
  ImpactDamage: ImpactDamage2;
  BulletImpulseFalloff: BulletImpulseFalloff2;
  BulletPierceability: BulletPierceability2;
  BulletElectron: BulletElectron2;
  DamageDropMinDistance: DamageDropMinDistance2;
  DamageDropPerMeter: DamageDropPerMeter2;
  DamageDropMinDamage: DamageDropMinDamage2;
}

export interface ImpactDamage2 {}

export interface BulletImpulseFalloff2 {}

export interface BulletPierceability2 {}

export interface BulletElectron2 {}

export interface DamageDropMinDistance2 {}

export interface DamageDropPerMeter2 {}

export interface DamageDropMinDamage2 {}

export interface Shield {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem4;
  Types: string[];
  Category: string;
}

export interface InstalledItem4 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Description: string;
  Manufacturer: Manufacturer5;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  DimensionOverrides: DimensionOverrides4;
  Shield: Shield2;
  Durability: Durability4;
  PowerConnection: PowerConnection3;
  HeatConnection: HeatConnection2;
}

export interface Manufacturer5 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides4 {
  Width: number;
  Height: number;
  Depth: number;
}

export interface Shield2 {
  Health: number;
  Regeneration: number;
  DownedDelay: number;
  DamagedDelay: number;
  Absorption: Absorption;
}

export interface Absorption {
  Physical: Physical;
  Energy: Energy;
  Distortion: Distortion;
  Thermal: Thermal;
  Biochemical: Biochemical;
  Stun: Stun;
}

export interface Physical {
  Minimum: number;
  Maximum: number;
}

export interface Energy {
  Minimum: number;
  Maximum: number;
}

export interface Distortion {
  Minimum: number;
  Maximum: number;
}

export interface Thermal {
  Minimum: number;
  Maximum: number;
}

export interface Biochemical {
  Minimum: number;
  Maximum: number;
}

export interface Stun {
  Minimum: number;
  Maximum: number;
}

export interface Durability4 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection3 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection2 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface PowerPlant {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem5;
  Types: string[];
  Category: string;
}

export interface InstalledItem5 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Description: string;
  Manufacturer: Manufacturer6;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  DimensionOverrides: DimensionOverrides5;
  PowerPlant: PowerPlant2;
  Durability: Durability5;
  PowerConnection: PowerConnection4;
  HeatConnection: HeatConnection3;
}

export interface Manufacturer6 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides5 {
  Width: number;
  Height: number;
  Depth: number;
}

export interface PowerPlant2 {
  Output: number;
}

export interface Durability5 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection4 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection3 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface Cooler {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem6;
  Types: string[];
  Category: string;
}

export interface InstalledItem6 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Description: string;
  Manufacturer: Manufacturer7;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  DimensionOverrides: DimensionOverrides6;
  Cooler: Cooler2;
  Durability: Durability6;
  PowerConnection: PowerConnection5;
  HeatConnection: HeatConnection4;
}

export interface Manufacturer7 {
  Code: string;
  Name: string;
}

export interface DimensionOverrides6 {
  Width: number;
  Height: number;
  Depth: number;
}

export interface Cooler2 {
  Rate: number;
}

export interface Durability6 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection5 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection4 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface QuantumFuelTank {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem7;
  Types: string[];
  Category: string;
}

export interface InstalledItem7 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Tags: string[];
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  QuantumFuelTank: QuantumFuelTank2;
}

export interface QuantumFuelTank2 {
  Capacity: number;
}

export interface MainThruster {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem8;
  Types: string[];
  Category: string;
}

export interface InstalledItem8 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Manufacturer: Manufacturer8;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  Thruster: Thruster;
  Durability: Durability7;
  PowerConnection: PowerConnection6;
  HeatConnection: HeatConnection5;
}

export interface Manufacturer8 {
  Code: string;
  Name: string;
}

export interface Thruster {
  ThrustCapacity: number;
  FuelRate: number;
  Type: string;
  MaxThrustFuelRate: number;
}

export interface Durability7 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection6 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection5 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface RetroThruster {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem9;
  Types: string[];
  Category: string;
}

export interface InstalledItem9 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Manufacturer: Manufacturer9;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  Thruster: Thruster2;
  Durability: Durability8;
  PowerConnection: PowerConnection7;
  HeatConnection: HeatConnection6;
}

export interface Manufacturer9 {
  Code: string;
  Name: string;
}

export interface Thruster2 {
  ThrustCapacity: number;
  FuelRate: number;
  Type: string;
  MaxThrustFuelRate: number;
}

export interface Durability8 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection7 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection6 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface ManeuveringThruster {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem10;
  Types: string[];
  Category: string;
}

export interface InstalledItem10 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Manufacturer: Manufacturer10;
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  Thruster: Thruster3;
  Durability: Durability9;
  PowerConnection: PowerConnection8;
  HeatConnection: HeatConnection7;
}

export interface Manufacturer10 {
  Code: string;
  Name: string;
}

export interface Thruster3 {
  ThrustCapacity: number;
  FuelRate: number;
  Type: string;
  MaxThrustFuelRate: number;
}

export interface Durability9 {
  Health: number;
  Lifetime: number;
}

export interface PowerConnection8 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection7 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export interface HydrogenFuelTank {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem11;
  Types: string[];
  Category: string;
}

export interface InstalledItem11 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Tags: string[];
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  HydrogenFuelTank: HydrogenFuelTank2;
}

export interface HydrogenFuelTank2 {
  Capacity: number;
}

export interface HydogenFuelIntake {
  PortName: string;
  Size: number;
  Loadout: string;
  InstalledItem: InstalledItem12;
  Types: string[];
  Category: string;
}

export interface InstalledItem12 {
  UUID: string;
  ClassName: string;
  Size: number;
  Grade: number;
  Type: string;
  Name: string;
  Tags: string[];
  Width: number;
  Height: number;
  Length: number;
  Volume: number;
  HydrogenFuelIntake: HydrogenFuelIntake;
  PowerConnection: PowerConnection9;
  HeatConnection: HeatConnection8;
}

export interface HydrogenFuelIntake {
  Rate: number;
}

export interface PowerConnection9 {
  PowerBase: number;
  PowerDraw: number;
}

export interface HeatConnection8 {
  ThermalEnergyBase: number;
  ThermalEnergyDraw: number;
  CoolingRate: number;
}

export default Root;
