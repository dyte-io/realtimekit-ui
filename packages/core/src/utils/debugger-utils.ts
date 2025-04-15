import { MediaKind } from '@cloudflare/realtimekit';

export type StatsHealth = 'Good' | 'Average' | 'Poor';

export interface FormattedStatsObj {
  name: string;
  value: string;
  description: string;
  verdict: StatsHealth;
}

/** Method to return media health based on the media & network stats */
export function getNetworkBasedMediaHealth({
  stats,
}: {
  kind: MediaKind;
  isScreenshare: boolean;
  stats: FormattedStatsObj[];
}): StatsHealth {
  if (!stats || !stats.length) {
    return null;
  }

  let networkHealth: StatsHealth = 'Good';

  const allStatsHealths = stats.map((statsObj) => statsObj.verdict);
  if (allStatsHealths.includes('Poor')) {
    networkHealth = 'Poor';
  } else if (allStatsHealths.includes('Average')) {
    networkHealth = 'Average';
  }
  return networkHealth;
}

/** Gives verdict based on the packet loss */
export function getPacketLossVerdict({
  packetLossPercentage,
}: {
  packetLossPercentage: number;
}): StatsHealth {
  let verdict: StatsHealth = 'Good';

  if (packetLossPercentage > 4) {
    verdict = 'Poor';
  } else if (packetLossPercentage >= 1 && packetLossPercentage <= 4) {
    verdict = 'Average';
  }

  return verdict;
}

/** Gives verdict based on the jitter */
export function getJitterVerdict({ jitterInMS }: { jitterInMS: number }): StatsHealth {
  let verdict: StatsHealth = 'Good';

  if (jitterInMS > 100) {
    verdict = 'Poor';
  } else if (jitterInMS >= 50 && jitterInMS <= 100) {
    verdict = 'Average';
  }

  return verdict;
}

/** Gives verdict based on the jitter */
export function getBitrateVerdict({
  bitrate,
}: {
  kind: MediaKind;
  isScreenshare: boolean;
  bitrate: number;
}): StatsHealth {
  let verdict: StatsHealth = 'Good';
  const bitrateInKbps = Math.round(bitrate / 1024); // it is Kilo bits

  if (bitrateInKbps === 0) {
    verdict = 'Poor';
  }

  return verdict;
}

export function getOverallBatteryVerdict({ stats }: { stats: FormattedStatsObj[] }): StatsHealth {
  if (!stats || !stats.length) {
    return null;
  }

  let networkHealth: StatsHealth = 'Good';

  const allStatsHealths = stats.map((statsObj) => statsObj.verdict);
  if (allStatsHealths.includes('Poor')) {
    networkHealth = 'Poor';
  } else if (allStatsHealths.includes('Average')) {
    networkHealth = 'Average';
  }
  return networkHealth;
}

export function getBatteryLevelVerdict({
  batteryLevelPercentage,
}: {
  batteryLevelPercentage: number;
}): StatsHealth {
  let batteryLevelVerdict: StatsHealth = 'Good';
  if (batteryLevelPercentage < 20) {
    batteryLevelVerdict = 'Poor';
  } else if (batteryLevelPercentage < 50) {
    batteryLevelVerdict = 'Average';
  }
  return batteryLevelVerdict;
}

export function getBatteryChargingVerdict({
  charging,
  dischargingTimeInSeconds,
  batteryLevelPercentage,
}: {
  charging: boolean;
  chargingTimeInSeconds: number;
  dischargingTimeInSeconds: number;
  batteryLevelPercentage: number;
}): StatsHealth {
  const MINS_30 = 30 * 60;

  if (batteryLevelPercentage < 20) {
    return 'Poor';
  }

  if (charging) {
    return 'Good';
  }

  if (dischargingTimeInSeconds < MINS_30) {
    return 'Poor';
  }
  return 'Average';
}
