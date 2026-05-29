import {
  LitElement,
  nothing,
  html,
  css,
} from "https://unpkg.com/lit-element@4.2.0/lit-element.js?module";
import { join } from "https://unpkg.com/lit-html@3.3.0/directives/join.js?module";
import { map } from "https://unpkg.com/lit-html@3.3.0/directives/map.js?module";

const CUSTOM_CARD_NAME = 'fyta-plant-card';

// Inlined translations. Source of truth: translations/{en,de}.json — keep both in sync.
// HACS only deploys this single .js file, so the JSON cannot be fetched at runtime.
const TRANSLATIONS = {
  en: {
    editor: {
      section: {
        device: 'Plant',
        measurements: 'Sensor Measurements',
        layout: 'Layout',
        nutrition_info_title: 'Nutrition and Salinity',
        nutrition_info_description: 'The Nutrition Score combines multiple measurements (salinity, conductivity, growth data, and fertilization timing) into a single metric. Showing salinity separately is generally not needed as it is already included in this score.',
      },
      field: {
        device_id: 'Device (Required)',
        title: 'Title',
        battery_threshold: 'Battery Threshold (%)',
        display_mode: 'Display Mode',
        state_color_plant: 'State color',
        preferred_image: 'Preferred image',
        show_scientific_name: 'Show scientific name',
        state_color_battery: 'Show battery state color',
        state_color_sensor: 'Show sensor state color',
        state_color_icon: 'Show colored state icons',
        stale_threshold_hours: 'Mark unavailable after (hours)',
        decimals: 'Sensor reading decimals',
      },
      option: {
        display_mode: { full: 'Full', compact: 'Compact' },
        state_color_plant: { image: 'Image', name: 'Name', disabled: 'Disabled' },
        preferred_image: { user: 'User', default: 'Default' },
        decimals: { untouched: 'Unchanged', zero: '0', one: '1' },
      },
    },
    card: {
      configure_prompt: 'Please select a FYTA device in the card configuration.',
      sensor_name: {
        battery: 'Battery',
        light: 'Light',
        moisture: 'Soil Moisture',
        nutrients: 'Nutrition',
        temperature: 'Ambient Temperature',
        salinity: 'Salinity',
      },
      measurement_status: {
        no_data: 'Unavailable',
        stale: 'Stale',
        not_configured: 'Entity not found',
        too_low: 'Too Low',
        low: 'Low',
        perfect: 'Perfect',
        high: 'High',
        too_high: 'Too High',
      },
      battery_status: {
        good: 'Good',
        full: 'Full',
        medium: 'Medium',
        low: 'Low',
        very_low: 'Very Low',
        critical: 'Critical',
        unknown: 'Unknown',
      },
      tooltip: {
        battery_level: 'Battery: {level}%',
        battery_unknown: 'Battery: Unknown',
        status: 'Status: {status}',
        sensor_value: '{name}: {value} {unit}',
        nutrition_status: 'Nutrition Status: {status}',
        fertilize_in_one: 'Fertilize in {days} day',
        fertilize_in_many: 'Fertilize in {days} days',
        fertilize_overdue_one: 'Fertilization overdue by {days} day',
        fertilize_overdue_many: 'Fertilization overdue by {days} days',
        last_fertilization: 'Last Fertilization: {date}',
        next_fertilization: 'Next Fertilization: {date}',
      },
      aria: {
        plant_details: 'Open plant details for {name}',
        sensor_details: 'Open {name} details',
      },
      unit: { day_one: 'day', day_many: 'days' },
    },
  },
  de: {
    editor: {
      section: {
        device: 'Pflanze',
        measurements: 'Sensor-Messwerte',
        layout: 'Layout',
        nutrition_info_title: 'Nährstoffe und Salzgehalt',
        nutrition_info_description: 'Der Nährstoff-Score fasst mehrere Messwerte (Salzgehalt, Leitfähigkeit, Wachstumsdaten und Düngezeitpunkt) zu einer einzelnen Kennzahl zusammen. Den Salzgehalt separat anzuzeigen ist in der Regel nicht nötig, da er in diesem Wert bereits enthalten ist.',
      },
      field: {
        device_id: 'Gerät (Erforderlich)',
        title: 'Titel',
        battery_threshold: 'Batterie-Schwellwert (%)',
        display_mode: 'Anzeigemodus',
        state_color_plant: 'Zustandsfarbe',
        preferred_image: 'Bevorzugtes Bild',
        show_scientific_name: 'Wissenschaftlichen Namen anzeigen',
        state_color_battery: 'Batterie-Statusfarbe anzeigen',
        state_color_sensor: 'Sensor-Statusfarbe anzeigen',
        state_color_icon: 'Farbige Status-Symbole anzeigen',
        stale_threshold_hours: 'Nach (Stunden) als nicht verfügbar markieren',
        decimals: 'Dezimalstellen der Sensorwerte',
      },
      option: {
        display_mode: { full: 'Vollständig', compact: 'Kompakt' },
        state_color_plant: { image: 'Bild', name: 'Name', disabled: 'Deaktiviert' },
        preferred_image: { user: 'Eigenes Bild', default: 'Standard' },
        decimals: { untouched: 'Unverändert', zero: '0', one: '1' },
      },
    },
    card: {
      configure_prompt: 'Bitte wähle ein FYTA-Gerät in der Kartenkonfiguration aus.',
      sensor_name: {
        battery: 'Batterie',
        light: 'Licht',
        moisture: 'Bodenfeuchte',
        nutrients: 'Nährstoffe',
        temperature: 'Umgebungstemperatur',
        salinity: 'Salzgehalt',
      },
      measurement_status: {
        no_data: 'Nicht verfügbar',
        stale: 'Veraltet',
        not_configured: 'Entität nicht gefunden',
        too_low: 'Zu niedrig',
        low: 'Niedrig',
        perfect: 'Perfekt',
        high: 'Hoch',
        too_high: 'Zu hoch',
      },
      battery_status: {
        good: 'Gut',
        full: 'Voll',
        medium: 'Mittel',
        low: 'Niedrig',
        very_low: 'Sehr niedrig',
        critical: 'Kritisch',
        unknown: 'Unbekannt',
      },
      tooltip: {
        battery_level: 'Batterie: {level}%',
        battery_unknown: 'Batterie: Unbekannt',
        status: 'Status: {status}',
        sensor_value: '{name}: {value} {unit}',
        nutrition_status: 'Nährstoffstatus: {status}',
        fertilize_in_one: 'Düngen in {days} Tag',
        fertilize_in_many: 'Düngen in {days} Tagen',
        fertilize_overdue_one: 'Düngung überfällig seit {days} Tag',
        fertilize_overdue_many: 'Düngung überfällig seit {days} Tagen',
        last_fertilization: 'Letzte Düngung: {date}',
        next_fertilization: 'Nächste Düngung: {date}',
      },
      aria: {
        plant_details: 'Pflanzendetails für {name} öffnen',
        sensor_details: 'Details für {name} öffnen',
      },
      unit: { day_one: 'Tag', day_many: 'Tage' },
    },
  },
};

const _lookupTranslation = (lang, keyParts) => {
  let node = TRANSLATIONS[lang];
  for (const part of keyParts) {
    if (node === null || typeof node !== 'object') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
};

const localize = (hass, key, placeholders = {}) => {
  const lang = (hass?.language || 'en').toLowerCase().split('-')[0];
  const keyParts = key.split('.');
  const value = _lookupTranslation(lang, keyParts) ?? _lookupTranslation('en', keyParts);
  if (typeof value !== 'string') return key;
  return Object.keys(placeholders).reduce(
    (acc, name) => acc.replaceAll(`{${name}}`, String(placeholders[name])),
    value,
  );
};

const DecimalsState = {
  UNTOUCHED: false,
  ZERO: 0,
  ONE: 1,
};

const DeviceClass = {
  BATTERY: 'battery',
  MOISTURE: 'moisture',
  TEMPERATURE: 'temperature',
};

const DisplayMode = {
  FULL: 'full',
  COMPACT: 'compact',
};

const EntityType = {
  IMAGE: 'image',
  SENSOR: 'sensor',
};

const MeasurementStatusStates = {
  NO_DATA: 'no_data',
  TOO_LOW: 'too_low',
  LOW: 'low',
  PERFECT: 'perfect',
  HIGH: 'high',
  TOO_HIGH: 'too_high',
};

const MeasurementStatusColors = {
  [MeasurementStatusStates.NO_DATA]: 'var(--disabled-text-color, #bdbdbd)',
  [MeasurementStatusStates.TOO_LOW]: 'var(--red-color, #f44336)',
  [MeasurementStatusStates.LOW]: 'var(--orange-color, #ff9800)',
  [MeasurementStatusStates.PERFECT]: 'var(--green-color, #4caf50)',
  [MeasurementStatusStates.HIGH]: 'var(--orange-color, #ff9800)',
  [MeasurementStatusStates.TOO_HIGH]: 'var(--red-color, #f44336)',
};

const PlantStatusStates = {
  DELETED: 'deleted',
  DOING_GREAT: 'doing_great',
  NEED_ATTENTION: 'need_attention',
  NO_SENSOR: 'no_sensor',
};

const PlantStatusColors = {
  [PlantStatusStates.DELETED]: 'var(--disabled-text-color, #bdbdbd)',
  [PlantStatusStates.DOING_GREAT]: 'var(--green-color, #4caf50)',
  [PlantStatusStates.NEED_ATTENTION]: 'var(--orange-color, #ff9800)',
  [PlantStatusStates.NO_SENSOR]: 'var(--disabled-text-color, #bdbdbd)',
};

const PlantStateColorState = {
  DISABLED: 'disabled',
  IMAGE: 'image',
  NAME: 'name',
};

const PreferredPlantImage = {
  USER: 'user',
  DEFAULT: 'default',
};

const SensorTypes = {
  BATTERY: 'battery',
  FERTILIZATION_LAST: 'fertilizationLast',
  FERTILIZATION_NEXT: 'fertilizationNext',
  LIGHT: 'light',
  LIGHT_STATE: 'light',
  MOISTURE: 'moisture',
  MOISTURE_STATE: 'moisture',
  NUTRIENTS: 'nutrients',
  NUTRIENTS_STATE: 'nutrients',
  PLANT_IMAGE_DEFAULT: 'plant_image_default',
  PLANT_IMAGE_USER: 'plant_image_user',
  PLANT_STATE: 'plant',
  SALINITY: 'salinity',
  SALINITY_STATE: 'salinity',
  SCIENTIFIC_NAME: 'scientificName',
  TEMPERATURE: 'temperature',
  TEMPERATURE_STATE: 'temperature',
};

const TranslationKeys = {
  FERTILIZATION_LAST: 'last_fertilised',
  FERTILIZATION_NEXT: 'next_fertilisation',
  LIGHT: 'light',
  LIGHT_STATUS: 'light_status',
  MOISTURE_STATUS: 'moisture_status',
  NUTRIENTS_STATUS: 'nutrients_status',
  PLANT_IMAGE_USER: 'plant_image_user',
  PLANT_STATUS: 'plant_status',
  SALINITY: 'salinity',
  SALINITY_STATUS: 'salinity_status',
  SCIENTIFIC_NAME: 'scientific_name',
  TEMPERATURE_STATUS: 'temperature_status',
};

const DEFAULT_CONFIG = {
  battery_threshold: 30,
  decimals: DecimalsState.UNTOUCHED,
  device_id: '',
  display_mode: DisplayMode.FULL,
  sensors: [
    { type: SensorTypes.LIGHT, isEnabled: true },
    { type: SensorTypes.MOISTURE, isEnabled: true },
    { type: SensorTypes.TEMPERATURE, isEnabled: true },
    { type: SensorTypes.NUTRIENTS, isEnabled: true },
    { type: SensorTypes.SALINITY, isEnabled: false },
  ],
  preferred_image: PreferredPlantImage.USER,
  show_scientific_name: true,
  state_color_battery: true,
  state_color_icon: true,
  state_color_plant: PlantStateColorState.IMAGE,
  state_color_sensor: true,
  stale_threshold_hours: 8,
  title: '',
};

const buildSchemaPartOne = (hass) => {
  const t = (key) => localize(hass, key);
  return [
    {
      name: 'header_device',
      type: 'constant',
      label: t('editor.section.device'),
    },
    {
      name: 'device_id',
      label: t('editor.field.device_id'),
      required: true,
      selector: {
        device: {
          integration: 'fyta',
        },
      },
    },
    {
      name: 'title',
      label: t('editor.field.title'),
      selector: {
        text: {},
      },
    },
    {
      name: 'header_measurements',
      type: 'constant',
      label: t('editor.section.measurements'),
    },
    {
      name: 'battery_threshold',
      label: t('editor.field.battery_threshold'),
      selector: {
        number: {
          min: 0,
          max: 100,
          step: 5,
          mode: 'slider',
        },
      },
      default: DEFAULT_CONFIG.battery_threshold,
    },
  ];
};

const buildSchemaPartTwo = (hass) => {
  const t = (key) => localize(hass, key);
  return [
    {
      name: 'nutrition_info',
      type: 'constant',
      label: t('editor.section.nutrition_info_title'),
      value: t('editor.section.nutrition_info_description'),
    },
    {
      name: 'header_layout',
      type: 'constant',
      label: t('editor.section.layout'),
    },
    {
      name: 'display_mode',
      label: t('editor.field.display_mode'),
      selector: {
        select: {
          options: [
            { label: t('editor.option.display_mode.full'), value: DisplayMode.FULL },
            { label: t('editor.option.display_mode.compact'), value: DisplayMode.COMPACT },
          ],
          mode: 'box',
        },
      },
      default: DEFAULT_CONFIG.display_mode,
    },
    {
      name: 'state_color_plant',
      label: t('editor.field.state_color_plant'),
      selector: {
        select: {
          options: [
            { label: t('editor.option.state_color_plant.image'), value: PlantStateColorState.IMAGE },
            { label: t('editor.option.state_color_plant.name'), value: PlantStateColorState.NAME },
            { label: t('editor.option.state_color_plant.disabled'), value: PlantStateColorState.DISABLED },
          ],
          mode: 'dropdown',
        },
      },
      default: DEFAULT_CONFIG.state_color_plant,
    },
    {
      name: 'stale_threshold_hours',
      label: t('editor.field.stale_threshold_hours'),
      selector: {
        number: {
          min: 1,
          max: 168,
          step: 1,
          mode: 'box',
        },
      },
      default: DEFAULT_CONFIG.stale_threshold_hours,
    },
    {
      name: 'preferred_image',
      label: t('editor.field.preferred_image'),
      selector: {
        select: {
          options: [
            { label: t('editor.option.preferred_image.user'), value: PreferredPlantImage.USER },
            { label: t('editor.option.preferred_image.default'), value: PreferredPlantImage.DEFAULT },
          ],
          mode: 'dropdown',
        },
      },
      default: DEFAULT_CONFIG.preferred_image,
    },
    {
      type: 'grid',
      schema: [
        {
          name: 'show_scientific_name',
          label: t('editor.field.show_scientific_name'),
          type: 'boolean',
          selector: { boolean: {} },
          default: DEFAULT_CONFIG.show_scientific_name,
        },
        {
          name: 'state_color_battery',
          label: t('editor.field.state_color_battery'),
          selector: { boolean: {} },
          default: DEFAULT_CONFIG.state_color_battery,
        },
      ],
    },
    {
      type: 'grid',
      schema: [
        {
          name: 'state_color_sensor',
          label: t('editor.field.state_color_sensor'),
          selector: { boolean: {} },
          default: DEFAULT_CONFIG.state_color_sensor,
        },
        {
          name: 'state_color_icon',
          label: t('editor.field.state_color_icon'),
          selector: { boolean: {} },
          default: DEFAULT_CONFIG.state_color_icon,
        },
      ],
    },
    {
      name: 'decimals',
      label: t('editor.field.decimals'),
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { label: t('editor.option.decimals.untouched'), value: DecimalsState.UNTOUCHED },
            { label: t('editor.option.decimals.zero'), value: DecimalsState.ZERO },
            { label: t('editor.option.decimals.one'), value: DecimalsState.ONE },
          ],
        },
      },
      default: DEFAULT_CONFIG.decimals,
    },
  ];
};

const SENSOR_SETTINGS = {
  [SensorTypes.BATTERY]: {
    min: 0,
    max: 100,
    icon: 'mdi:battery',
  },
  [SensorTypes.LIGHT]: {
    icon: 'mdi:white-balance-sunny',
  },
  [SensorTypes.MOISTURE]: {
    min: 0,
    max: 100,
    icon: 'mdi:water',
  },
  [SensorTypes.NUTRIENTS]: {
    icon: 'mdi:bucket',
  },
  [SensorTypes.TEMPERATURE]: {
    min: 0,
    max: 50,
    icon: 'mdi:thermometer',
  },
  [SensorTypes.SALINITY]: {
    icon: 'mdi:water-percent',
  },
};

const parseConfig = (config) => {
  // Create a completely new config object with all defaults set
  const newConfig = { ...DEFAULT_CONFIG };

  let containsLegacyKeys = false;
  // Then copy values from provided config
  if (config) {
    Object.keys(config).forEach((key) => {
      if (
        key.includes('_order') ||
        ['show_light', 'show_moisture', 'show_temperature', 'show_nutrition', 'show_salinity'].includes(key)
      ) {
        containsLegacyKeys = true;
      } else if (key === 'sensor') {
        if (config.sensors === undefined) {
          newConfig.sensors = config[key];
        }
      } else {
        newConfig[key] = config[key];
      }
    });
  }

  // Upgrade legacy config from sensor order values
  if (containsLegacyKeys) {
    const LegacySensorType = {
      NUTRITION: 'nutrition'
    };

    const legacySensorKeyTypes = [
      SensorTypes.LIGHT,
      SensorTypes.MOISTURE,
      SensorTypes.TEMPERATURE,
      SensorTypes.SALINITY,
      LegacySensorType.NUTRITION,
    ];

    newConfig.sensors = legacySensorKeyTypes
      .map((sensorType) => {
        const orderKey = `${sensorType}_order`;

        let orderValue = 5;
        if (config[orderKey] !== undefined) {
          orderValue = String(config[orderKey]);
        }
        const type = sensorType === LegacySensorType.NUTRITION ? SensorTypes.NUTRIENTS : sensorType;
        return { type, order: orderValue, isEnabled: config[`show_${sensorType}`] || false };
      })
      .sort((a, b) => a.order - b.order)
      .map(({ type, isEnabled }) => {
        return { type, isEnabled };
      });
  }

  if (!Array.isArray(newConfig.sensors) || newConfig.sensors.length === 0) {
    newConfig.sensors = DEFAULT_CONFIG.sensors;
  }

  // Upgrade legacy config from boolean plant state color value
  if (typeof newConfig.state_color_plant === 'boolean') {
    newConfig.state_color_plant = newConfig.state_color_plant === true ? PlantStateColorState.NAME : PlantStateColorState.IMAGE;
  }

  return newConfig;
};

const buildEmptyEntityMaps = () => ({
  measurementIds: {
    [SensorTypes.BATTERY]: '',
    [SensorTypes.LIGHT]: '',
    [SensorTypes.MOISTURE]: '',
    [SensorTypes.TEMPERATURE]: '',
    [SensorTypes.SALINITY]: '',
  },
  stateIds: {
    [SensorTypes.LIGHT_STATE]: '',
    [SensorTypes.MOISTURE_STATE]: '',
    [SensorTypes.NUTRIENTS_STATE]: '',
    [SensorTypes.PLANT_STATE]: '',
    [SensorTypes.SALINITY_STATE]: '',
    [SensorTypes.TEMPERATURE_STATE]: '',
  },
  otherIds: {
    [SensorTypes.FERTILIZATION_LAST]: '',
    [SensorTypes.FERTILIZATION_NEXT]: '',
    [SensorTypes.PLANT_IMAGE_DEFAULT]: '',
    [SensorTypes.PLANT_IMAGE_USER]: '',
    [SensorTypes.SCIENTIFIC_NAME]: '',
  },
});

const classifyPlantEntity = (id, hass, maps) => {
  const hassState = hass.states[id];
  if (!hassState) return;

  const hassEntity = hass.entities[id];
  if (!hassEntity) return;

  if (id.startsWith('image.')) {
    if (hassEntity.translation_key === TranslationKeys.PLANT_IMAGE_USER) {
      maps.otherIds[SensorTypes.PLANT_IMAGE_USER] = hassState.entity_id;
      return;
    }
    maps.otherIds[SensorTypes.PLANT_IMAGE_DEFAULT] = hassState.entity_id;
    return;
  }

  if (!id.startsWith(EntityType.SENSOR)) return;

  switch (hassEntity.translation_key) {
    case TranslationKeys.LIGHT_STATUS:
    case TranslationKeys.MOISTURE_STATUS:
    case TranslationKeys.NUTRIENTS_STATUS:
    case TranslationKeys.PLANT_STATUS:
    case TranslationKeys.SALINITY_STATUS:
    case TranslationKeys.TEMPERATURE_STATUS: {
      maps.stateIds[hassEntity.translation_key.replace('_status', '')] = hassState.entity_id;
      return;
    }
    case TranslationKeys.FERTILIZATION_LAST: {
      maps.otherIds[SensorTypes.FERTILIZATION_LAST] = hassState.entity_id;
      return;
    }
    case TranslationKeys.FERTILIZATION_NEXT: {
      maps.otherIds[SensorTypes.FERTILIZATION_NEXT] = hassState.entity_id;
      return;
    }
    case TranslationKeys.LIGHT: {
      maps.measurementIds[SensorTypes.LIGHT] = hassState.entity_id;
      return;
    }
    case TranslationKeys.SALINITY: {
      maps.measurementIds[SensorTypes.SALINITY] = hassState.entity_id;
      return;
    }
    case TranslationKeys.SCIENTIFIC_NAME: {
      maps.otherIds[SensorTypes.SCIENTIFIC_NAME] = hassState.entity_id;
      return;
    }
    default: {
      switch (hassState.attributes.device_class) {
        case DeviceClass.BATTERY:
        case DeviceClass.MOISTURE:
        case DeviceClass.TEMPERATURE: {
          maps.measurementIds[hassState.attributes.device_class] = hassState.entity_id;
          return;
        }
      }
    }
  }
};

const entityStateSignature = (hass, entityId) => {
  const state = hass.states[entityId];
  if (!state) return 'missing';

  if (entityId.startsWith('image.')) {
    return JSON.stringify([state.attributes?.entity_picture || '']);
  }

  return JSON.stringify([
    state.state,
    state.attributes?.entity_picture || '',
    state.attributes?.unit_of_measurement || '',
    state.display_precision ?? '',
  ]);
};

const resolvePlantEntities = (hass, deviceId) => {
  if (!hass || !deviceId) return null;

  const maps = buildEmptyEntityMaps();
  Object.keys(hass.entities || {})
    .filter((id) => hass.entities[id].device_id === deviceId)
    .forEach((id) => classifyPlantEntity(id, hass, maps));

  const trackedIds = [
    ...Object.values(maps.measurementIds),
    ...Object.values(maps.stateIds),
    ...Object.values(maps.otherIds),
  ].filter(Boolean).sort();

  const deviceName = hass.devices?.[deviceId]?.name || '';
  const signature = JSON.stringify({
    deviceName,
    maps,
    trackedIds,
    states: trackedIds.map((id) => entityStateSignature(hass, id)),
  });

  return Object.freeze({
    measurementIds: Object.freeze({ ...maps.measurementIds }),
    stateIds: Object.freeze({ ...maps.stateIds }),
    otherIds: Object.freeze({ ...maps.otherIds }),
    trackedIds,
    signature,
  });
};

const MeterClass = {
  BAD: 'bad',
  GOOD: 'good',
  UNAVAILABLE: 'unavailable',
  STALE: 'stale',
  WARNING: 'warning',
};

const calculateMeterState = (sensorSettings, sensorEntity, statusState, readingState = SensorReadingStates.AVAILABLE) => {
  const sensorValue = sensorEntity !== null ? sensorEntity.state : null;
  const numericSensorValue = sensorValue !== null && String(sensorValue).trim() !== '' && !isNaN(Number(sensorValue))
    ? Number(sensorValue)
    : null;

  if (readingState === SensorReadingStates.NO_DATA || readingState === SensorReadingStates.NOT_CONFIGURED) {
    return { percentage: 0, class: MeterClass.UNAVAILABLE };
  }

  let percentage = null;
  if (numericSensorValue !== null && sensorSettings.min !== null && sensorSettings.max != null) {
    const calculatedPercentage = (numericSensorValue - sensorSettings.min) / (sensorSettings.max - sensorSettings.min) * 100;
    percentage = Math.max(0, Math.min(100, calculatedPercentage));
  }

  switch (statusState) {
    case MeasurementStatusStates.TOO_LOW:
      return { percentage: percentage !== null ? percentage : 10, class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.BAD };
    case MeasurementStatusStates.LOW:
      return { percentage: percentage !== null ? percentage : 30, class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.WARNING };
    case MeasurementStatusStates.PERFECT:
      return { percentage: percentage !== null ? percentage : 50, class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.GOOD };
    case MeasurementStatusStates.HIGH:
      return { percentage: percentage !== null ? percentage : 70, class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.WARNING };
    case MeasurementStatusStates.TOO_HIGH:
      return { percentage: percentage !== null ? percentage : 90, class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.BAD };
    default:
      return {
        percentage: percentage !== null ? percentage : 0,
        class: readingState === SensorReadingStates.STALE ? MeterClass.STALE : MeterClass.UNAVAILABLE,
      };
  }
};

const formatDecimals = (value, decimals = 0) => {
  const numberValue = Number(value);
  return isNaN(numberValue) ? '' : numberValue.toFixed(decimals);
};

const isNumericSensorState = (value) => value !== null && String(value).trim() !== '' && !isNaN(Number(value));

const formatSensorValue = (sensorEntity, configDecimals) => {
  const sensorValue = sensorEntity.state;
  if (configDecimals !== false) {
    return formatDecimals(sensorValue, configDecimals);
  }
  const entityPrecision = sensorEntity.display_precision;
  if (!isNaN(entityPrecision)) {
    return formatDecimals(sensorValue, entityPrecision);
  }
  // Guard against HA sentinel strings ('unknown', 'unavailable', 'none', …):
  // only return the raw state when it is actually numeric; otherwise signal
  // the absence of a reading with an empty string.
  return isNumericSensorState(sensorValue) ? sensorValue : '';
};

const formatDisplayUnit = (unit) => {
  if (!unit) return '';
  return unit;
};

// Strip the time component from an ISO date string
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  return dateString;
};

const parseLocalCalendarDate = (inputDateString) => {
  const match = String(inputDateString).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  const parsed = new Date(inputDateString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const calculateDaysFromNow = (inputDateString) => {
  if (!inputDateString) return null;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const inputDate = parseLocalCalendarDate(inputDateString);
  if (!inputDate) return null;
  const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
  return Math.round((inputDate.getTime() - currentDate.getTime()) / DAY_IN_MILLISECONDS);
};

const SensorReadingStates = {
  AVAILABLE: 'available',
  NO_DATA: 'no_data',
  NOT_CONFIGURED: 'not_configured',
  STALE: 'stale',
};

const colorForMeasurementState = (state) =>
  MeasurementStatusColors[state || MeasurementStatusStates.NO_DATA];

const colorForSensorReadingState = (readingState, status) => {
  switch (readingState) {
    case SensorReadingStates.STALE:
      return 'var(--orange-color, #ff9800)';
    case SensorReadingStates.NO_DATA:
    case SensorReadingStates.NOT_CONFIGURED:
      return 'var(--disabled-text-color, #bdbdbd)';
    default:
      return colorForMeasurementState(isMissingSensorState(status) ? MeasurementStatusStates.NO_DATA : status);
  }
};

const isMissingSensorState = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === '' || normalized === 'unknown' || normalized === 'unavailable' || normalized === 'none';
};

const isSensorReadingStale = (sensorEntity, staleThresholdHours) => {
  const thresholdHours = Number(staleThresholdHours);
  if (!Number.isFinite(thresholdHours) || thresholdHours <= 0) {
    return false;
  }

  const lastUpdatedMs = Date.parse(sensorEntity?.last_updated || '');
  if (Number.isNaN(lastUpdatedMs)) {
    return false;
  }

  const thresholdMs = thresholdHours * 60 * 60 * 1000;
  return Date.now() - lastUpdatedMs > thresholdMs;
};

const getNumericSensorReadingState = (sensorEntity, staleThresholdHours) => {
  if (!sensorEntity) {
    return SensorReadingStates.NOT_CONFIGURED;
  }
  if (!isNumericSensorState(sensorEntity.state)) {
    return SensorReadingStates.NO_DATA;
  }
  return isSensorReadingStale(sensorEntity, staleThresholdHours)
    ? SensorReadingStates.STALE
    : SensorReadingStates.AVAILABLE;
};

const getTextSensorReadingState = (sensorEntity, staleThresholdHours) => {
  if (!sensorEntity) {
    return SensorReadingStates.NOT_CONFIGURED;
  }
  if (isMissingSensorState(sensorEntity.state)) {
    return SensorReadingStates.NO_DATA;
  }
  return isSensorReadingStale(sensorEntity, staleThresholdHours)
    ? SensorReadingStates.STALE
    : SensorReadingStates.AVAILABLE;
};

const buildMissingMeterViewModel = (sensorType) => ({
  kind: 'meter',
  sensorType,
  entityId: '',
  icon: SENSOR_SETTINGS[sensorType].icon,
  color: colorForSensorReadingState(SensorReadingStates.NOT_CONFIGURED, ''),
  formattedValue: '',
  unitOfMeasurement: '',
  displayUnit: '',
  meter: { percentage: 0, class: MeterClass.UNAVAILABLE },
  status: '',
  readingState: SensorReadingStates.NOT_CONFIGURED,
});

const buildNutritionViewModel = (hass, entities, staleThresholdHours = DEFAULT_CONFIG.stale_threshold_hours) => {
  const statusEntityId = entities.stateIds[SensorTypes.NUTRIENTS_STATE] || '';
  const sensorEntity = statusEntityId ? hass.states[statusEntityId] : null;
  const readingState = getTextSensorReadingState(sensorEntity, staleThresholdHours);

  if (readingState === SensorReadingStates.NOT_CONFIGURED) {
    return {
      kind: 'nutrition',
      sensorType: SensorTypes.NUTRIENTS,
      entityId: '',
      icon: SENSOR_SETTINGS[SensorTypes.NUTRIENTS].icon,
      color: colorForSensorReadingState(readingState, ''),
      meter: { percentage: 0, class: MeterClass.UNAVAILABLE },
      status: '',
      readingState,
      daysUntilFertilization: null,
      lastFertilizationDateString: null,
      nextFertilizationDateString: null,
    };
  }

  const sensorState = sensorEntity?.state || '';

  const fertiliseLastEntityId = entities.otherIds[SensorTypes.FERTILIZATION_LAST] || '';
  const fertiliseNextEntityId = entities.otherIds[SensorTypes.FERTILIZATION_NEXT] || '';

  const nextFertilizationDateString =
    fertiliseNextEntityId && hass.states[fertiliseNextEntityId] ? hass.states[fertiliseNextEntityId].state : null;
  const lastFertilizationDateString =
    fertiliseLastEntityId && hass.states[fertiliseLastEntityId] ? hass.states[fertiliseLastEntityId].state : null;
  const daysUntilFertilization = nextFertilizationDateString ? calculateDaysFromNow(nextFertilizationDateString) : null;

  return {
    kind: 'nutrition',
    sensorType: SensorTypes.NUTRIENTS,
    entityId: statusEntityId,
    icon: SENSOR_SETTINGS[SensorTypes.NUTRIENTS].icon,
    color: colorForSensorReadingState(readingState, sensorState),
    meter: calculateMeterState(SENSOR_SETTINGS[SensorTypes.NUTRIENTS], null, sensorState, readingState),
    status: sensorState,
    readingState,
    daysUntilFertilization,
    lastFertilizationDateString,
    nextFertilizationDateString,
  };
};

const BATTERY_APPEARANCE_FALLBACK = Object.freeze({
  icon: 'mdi:battery-alert-variant-outline',
  color: 'var(--red-color, #f44336)',
  statusKey: 'unknown',
});

const BATTERY_APPEARANCE_LEVELS = Object.freeze([
  { threshold: 91, icon: 'mdi:battery',        color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'full' },
  { threshold: 81, icon: 'mdi:battery-90',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'good' },
  { threshold: 71, icon: 'mdi:battery-80',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'good' },
  { threshold: 61, icon: 'mdi:battery-70',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'good' },
  { threshold: 51, icon: 'mdi:battery-60',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'good' },
  { threshold: 41, icon: 'mdi:battery-50',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'medium' },
  { threshold: 31, icon: 'mdi:battery-40',     color: 'var(--state-sensor-battery-high-color, #4caf50)',   statusKey: 'medium' },
  { threshold: 21, icon: 'mdi:battery-30',     color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusKey: 'low' },
  { threshold: 11, icon: 'mdi:battery-20',     color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusKey: 'low' },
  { threshold: 6,  icon: 'mdi:battery-10',     color: 'var(--state-sensor-battery-low-color, #f44336)',    statusKey: 'very_low' },
  { threshold: 0,  icon: 'mdi:battery-alert',  color: 'var(--state-sensor-battery-low-color, #f44336)',    statusKey: 'critical' },
  { threshold: -Infinity, icon: 'mdi:battery-alert-variant-outline', color: 'var(--state-sensor-battery-low-color, #f44336)', statusKey: 'unknown' },
]);

const batteryAppearance = (batteryLevel) => {
  if (typeof batteryLevel !== 'number' || isNaN(batteryLevel)) {
    return BATTERY_APPEARANCE_FALLBACK;
  }
  return BATTERY_APPEARANCE_LEVELS.find(({ threshold }) => batteryLevel >= threshold) || BATTERY_APPEARANCE_FALLBACK;
};

const buildSensorViewModel = (sensorType, hass, entities, config) => {
  if (sensorType === SensorTypes.NUTRIENTS) {
    return buildNutritionViewModel(hass, entities, config.stale_threshold_hours);
  }

  const sensorEntityId = entities.measurementIds[sensorType] || '';
  if (!sensorEntityId) return buildMissingMeterViewModel(sensorType);

  const sensorEntity = hass.states[sensorEntityId];
  if (!sensorEntity) return buildMissingMeterViewModel(sensorType);

  const sensorSettings = SENSOR_SETTINGS[sensorType];
  const statusEntityId = entities.stateIds[sensorType] || '';
  const status = statusEntityId ? (hass.states[statusEntityId]?.state || '') : '';
  const readingState = getNumericSensorReadingState(sensorEntity, config.stale_threshold_hours);
  const unitOfMeasurement = sensorEntity.attributes.unit_of_measurement || '';
  const hasVisibleValue = readingState === SensorReadingStates.AVAILABLE || readingState === SensorReadingStates.STALE;

  return {
    kind: 'meter',
    sensorType,
    entityId: sensorEntityId,
    icon: sensorSettings.icon,
    color: colorForSensorReadingState(readingState, status),
    formattedValue: hasVisibleValue ? formatSensorValue(sensorEntity, config.decimals) : '',
    unitOfMeasurement,
    displayUnit: formatDisplayUnit(unitOfMeasurement),
    meter: calculateMeterState(sensorSettings, sensorEntity, status, readingState),
    status,
    readingState,
  };
};

class FytaPlantCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  static getConfigElement() {
    return document.createElement(`${CUSTOM_CARD_NAME}-editor`);
  }

  static getStubConfig() {
    return DEFAULT_CONFIG;
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this._entities = null;
  }

  _calculateSize(gridSize) {
    // Calculate card size dependent on display mode and number of sensors shown
    const baseHeight = this.config?.display_mode === DisplayMode.FULL ? 130 : 90; // Base size

    // Count enabled sensors and add 0.5 to base size for each sensor beyond the first 2
    const sensorCount = this.config.sensors?.reduce((accumulator, item) => accumulator + (item?.isEnabled ? 1 : 0), 0);
    const attributesHeight = Math.ceil(sensorCount / 2) * 30;

    const cardHeight = baseHeight + attributesHeight;

    return Math.ceil(cardHeight / gridSize * 2) / 2;
  }

  getCardSize() {
    return this._calculateSize(50);
  }

  getLayoutOptions() {
    const gridRows = this._calculateSize(56);

    return {
      grid_rows: gridRows,
      grid_columns: 4,
      grid_min_rows: 3,
      grid_min_columns: 2,
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this.config = parseConfig(config);
  }

  _click(entityId) {
    if (!entityId) return;
    const event = new Event(('hass-more-info'), {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    event.detail = { entityId };
    this.dispatchEvent(event);
    return event;
  }

  _handleKeyboardActivation(event, entityId) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this._click(entityId);
  }

  _getStateColor(stateType, hass) {
    const stateIds = this._entities?.stateIds || {};
    switch (stateType) {
      case SensorTypes.LIGHT_STATE:
      case SensorTypes.MOISTURE_STATE:
      case SensorTypes.NUTRIENTS_STATE:
      case SensorTypes.SALINITY_STATE:
      case SensorTypes.TEMPERATURE_STATE: {
        const entityId = stateIds[stateType] || '';
        const state = hass.states[entityId]?.state || MeasurementStatusStates.NO_DATA;
        return MeasurementStatusColors[state];
      }
      case SensorTypes.PLANT_STATE: {
        const entityId = stateIds[stateType] || '';
        const state = hass.states[entityId]?.state || PlantStatusStates.NO_SENSOR;
        return PlantStatusColors[state];
      }
      default: {
        return 'var(--primary-text-color, #ffffff)';
      }
    }
  }

  _getPlantImageSrc(hass) {
    const otherIds = this._entities?.otherIds || {};

    if (this.config.preferred_image === PreferredPlantImage.USER) {
      const userImageEntityId = otherIds[SensorTypes.PLANT_IMAGE_USER];

      if (userImageEntityId && hass.states[userImageEntityId]?.attributes.entity_picture) {
        return hass.states[userImageEntityId]?.attributes.entity_picture || '';
      }
    }

    const defaultImageEntityId = otherIds[SensorTypes.PLANT_IMAGE_DEFAULT];
    if (defaultImageEntityId && hass.states[defaultImageEntityId]?.attributes.entity_picture) {
      return hass.states[defaultImageEntityId]?.attributes.entity_picture || '';
    }

    return '';
  };

  shouldUpdate(changedProps) {
    if (changedProps.has('config') || !changedProps.has('hass')) {
      return true;
    }

    const oldHass = changedProps.get('hass');
    if (!oldHass || !this.hass || !this.config?.device_id) {
      return true;
    }

    const deviceId = this.config.device_id;
    const oldSignature = resolvePlantEntities(oldHass, deviceId)?.signature || '';
    const newSignature = resolvePlantEntities(this.hass, deviceId)?.signature || '';
    return oldSignature !== newSignature;
  }

  static get styles() {
    return css`
      ha-card {
        position: relative;
        padding: 0;
        background-size: 100%;
        margin-top: 25px;
      }

      img {
        display: block;
        height: auto;
        transition: filter .2s linear;
        width: 100%;
      }

      .header {
        padding-top: 8px;
        height: 72px;
        position: relative;
        display: flex;
      }

      .header #plant-image {
        width: 90px;
        margin: -28px 16px 0px;
      }

      .header #plant-image > img,
      .header #plant-image > .plant-placeholder {
        border-radius: 50%;
        width: 90px;
        height: 90px;
        box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
      }

      .header #plant-image > img {
        object-fit: cover;
      }

      .header #plant-image > .plant-placeholder {
        align-items: center;
        background: var(--secondary-background-color, #eeeeee);
        color: var(--secondary-text-color, #727272);
        display: flex;
        justify-content: center;
      }

      .header #plant-image > .plant-placeholder ha-icon {
        height: 42px;
        width: 42px;
      }

      .header #plant-image > .state {
        width: 86px;
        height: 86px;
        border-color: var(--disabled-text-color, #bdbdbd);
        border-width: 2px;
        border-style: solid;
      }

      .header #plant-text {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        margin-right: 12px;
        height: 44px;
        justify-content: center;
        overflow: hidden;
      }

      .header #plant-text > #name {
        font-weight: bold;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .header #plant-text > #scientific-name {
        color: var(--secondary-text-color, #727272);
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .header #plant-battery {
        margin-top: 18px;
        margin-right: 16px;
      }

      .attributes {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 16px 16px 8px;
        white-space: nowrap;
      }

      .attribute {
        white-space: nowrap;
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 8px;
      }

      .interactive {
        cursor: pointer;
      }

      .interactive:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
      }

      .attribute ha-icon {
        margin-right: 8px;
        flex-shrink: 0;
        width: 24px;
        text-align: center;
      }

      .sensor-value {
        flex-shrink: 0;
        margin-right: 4px;
        text-align: right;
        min-width: 40px;
      }

      .meter {
        height: 8px;
        background-color: var(--primary-background-color, #fafafa);
        border-radius: 2px;
        margin-right: 8px;
        display: inline-grid;
        overflow: hidden;
        flex-grow: 1;
        max-width: none;
      }

      .meter > span {
        grid-row: 1;
        grid-column: 1;
        height: 100%;
        background-color: var(--primary-text-color, #212121);
      }

      .meter > .good {
        background-color: var(--green-color, #4caf50);
      }

      .meter > .bad {
        background-color: var(--red-color, #f44336);
      }

      .meter > .warning {
        background-color: var(--orange-color, #ff9800);
      }

      .meter > .stale {
        background-color: var(--orange-color, #ff9800);
        opacity: 0.75;
      }

      .meter > .unavailable {
        background-color: var(--grey-color, #9e9e9e);
      }

      .divider {
        height: 1px;
        background-color: var(--secondary-text-color, #727272);
        opacity: 0.25;
        margin-left: 8px;
        margin-right: 8px;
      }

      .tooltip {
        position: relative;
      }

      .tooltip .tip {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        padding: 6px 10px;
        top: 3.3em;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-180%);
        transform: translateX(-50%) translateY(-180%);
        background-color: var(--grey-color, #9e9e9e);
        color: var(--white-color, #ffffff);
        white-space: nowrap;
        z-index: 2;
        border-radius: 2px;
        transition: opacity 0.2s cubic-bezier(0.64, 0.09, 0.08, 1), transform 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
      }

      .battery.tooltip .tip {
        top: 2em;
      }

      .tooltip:hover .tip, .tooltip:active .tip {
        display: block;
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(-50%) translateY(-200%);
        transform: translateX(-50%) translateY(-200%);
      }

      .uom {
        color: var(--secondary-text-color, #727272);
        font-size: 0.9em;
        flex-shrink: 0;
        text-align: left;
        min-width: 30px;
        width: auto;
        margin-right: 4px;
      }

      .sensor-state {
        flex-shrink: 0;
        font-size: 0.75em;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--secondary-text-color, #727272);
        margin-right: 4px;
      }

      .sensor-state.stale {
        color: var(--orange-color, #ff9800);
      }

      .sensor-state.no_data,
      .sensor-state.not_configured {
        color: var(--disabled-text-color, #bdbdbd);
      }

      .sensor-row {
      }

      .sensor-column {
        width: 50%;
        box-sizing: border-box;
      }

      .sensor-column-left {
        padding-right: 12px;      
      }

      .compact-mode .attribute {
        padding-bottom: 4px;
      }

      .compact-mode .meter {
        max-width: none;
      }

      .compact-mode .sensor-value,
      .compact-mode .uom {
        display: none;
      }

      .compact-mode #plant-text {
        margin-top: 8px;
      }

      /* We'll use the same header style as normal mode, but with reduced padding */
      .compact-mode .header {
        padding-top: 6px;
        height: 64px;
      }

      .compact-mode .header #plant-image {
        width: 78px;
        margin: -24px 16px 0px;
      }

      .compact-mode .header #plant-image > img,
      .compact-mode .header #plant-image > .plant-placeholder {
        width: 78px;
        height: 78px;
      }

      .compact-mode .header #plant-image > .state {
        width: 74px;
        height: 74px;
        border-color: var(--disabled-text-color, #bdbdbd);
        border-width: 2px;
        border-style: solid;
      }

      .compact-mode #plant-battery {
        margin-top: 16px;
      }

      /* Reduce padding in the attributes section for compact mode */
      .compact-mode .attributes {
        padding: 4px 16px 0px;
      }
    `;
  }

  render() {
    if (!this.hass || !this.config) {
      console.debug(`hass or config not set.`);
      return nothing;
    }

    // If no device is specified, show a configuration prompt
    if (!this.config.device_id) {
      return html`
        <ha-card>
          <hui-warning>
            ${localize(this.hass, 'card.configure_prompt')}
          </hui-warning>
        </ha-card>
      `;
    }

    const deviceId = this.config.device_id;
    if (!deviceId) {
      console.debug(`device_id not set.`);
      return;
    }

    const device = this.hass.devices[deviceId];
    const title = this.config?.title || device?.name || '';

    this._entities = resolvePlantEntities(this.hass, deviceId);
    const plantStateEntityId = this._entities?.stateIds[SensorTypes.PLANT_STATE] || '';
    const scientificNameEntityId = this._entities?.otherIds[SensorTypes.SCIENTIFIC_NAME] || '';
    const plantImageSrc = this._getPlantImageSrc(this.hass);
    const plantDetailsLabel = localize(this.hass, 'card.aria.plant_details', { name: title || localize(this.hass, 'editor.section.device') });

    return html`
      <ha-card>
        <div id="container" class="${this.config.display_mode === DisplayMode.COMPACT ? 'compact-mode' : ''}">
          <div class="header">
            <div
              id="plant-image"
              class="${plantStateEntityId ? 'interactive' : ''}"
              role="${plantStateEntityId ? 'button' : nothing}"
              tabindex="${plantStateEntityId ? '0' : nothing}"
              aria-label="${plantStateEntityId ? plantDetailsLabel : nothing}"
              @click="${this._click.bind(this, plantStateEntityId)}"
              @keydown="${(event) => this._handleKeyboardActivation(event, plantStateEntityId)}"
            >
              ${plantImageSrc ? html`
                <img
                  src="${plantImageSrc}"
                  alt="${title}"
                  class="${this.config.state_color_plant === PlantStateColorState.IMAGE ? 'state' : ''}"
                  style="${this.config.state_color_plant === PlantStateColorState.IMAGE ? `border-color:${this._getStateColor(SensorTypes.PLANT_STATE, this.hass)};` : ''}"
                >
              ` : html`
                <div
                  class="plant-placeholder ${this.config.state_color_plant === PlantStateColorState.IMAGE ? 'state' : ''}"
                  style="${this.config.state_color_plant === PlantStateColorState.IMAGE ? `border-color:${this._getStateColor(SensorTypes.PLANT_STATE, this.hass)};` : ''}"
                  aria-hidden="true"
                >
                  <ha-icon icon="mdi:sprout"></ha-icon>
                </div>
              `}
            </div>
            <div id="plant-text">
              <span
                id="name"
                class="${plantStateEntityId ? 'interactive' : ''}"
                role="${plantStateEntityId ? 'button' : nothing}"
                tabindex="${plantStateEntityId ? '0' : nothing}"
                aria-label="${plantStateEntityId ? plantDetailsLabel : nothing}"
                style="${this.config.state_color_plant === PlantStateColorState.NAME ? `color:${this._getStateColor(SensorTypes.PLANT_STATE, this.hass)};` : ''}"
                @click="${this._click.bind(this, plantStateEntityId)}"
                @keydown="${(event) => this._handleKeyboardActivation(event, plantStateEntityId)}"
              >${title}</span>
              ${this.config.show_scientific_name ? html`<span
                id="scientific-name"
                class="${plantStateEntityId ? 'interactive' : ''}"
                role="${plantStateEntityId ? 'button' : nothing}"
                tabindex="${plantStateEntityId ? '0' : nothing}"
                aria-label="${plantStateEntityId ? plantDetailsLabel : nothing}"
                @click="${this._click.bind(this, plantStateEntityId)}"
                @keydown="${(event) => this._handleKeyboardActivation(event, plantStateEntityId)}"
              >${this.hass.states[scientificNameEntityId]?.state || ''}</span>`: nothing}
            </div>
            ${this._renderBattery(this.hass)}
          </div>
          <div class="divider"></div>
          <div class="attributes">
            ${this._renderSensors(this.hass)}
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderBattery(hass) {
    const entityId = this._entities?.measurementIds[SensorTypes.BATTERY] || '';
    if (entityId === '') {
      return nothing;
    }

    const batteryLevel = Number.parseFloat(hass.states[entityId].state);
    const threshold = this.config?.battery_threshold ?? DEFAULT_CONFIG.battery_threshold;

    // Display policy: 0 means never show; otherwise only show at or below the threshold.
    if (threshold === 0 || (Number.isFinite(batteryLevel) && batteryLevel > threshold)) {
      return '';
    }

    const { icon, color, statusKey } = batteryAppearance(batteryLevel);
    const statusText = localize(hass, `card.battery_status.${statusKey}`);
    const batteryLine = Number.isFinite(batteryLevel)
      ? localize(hass, 'card.tooltip.battery_level', { level: batteryLevel })
      : localize(hass, 'card.tooltip.battery_unknown');
    const statusLine = localize(hass, 'card.tooltip.status', { status: statusText });
    const sensorName = localize(hass, 'card.sensor_name.battery');
    const detailsLabel = localize(hass, 'card.aria.sensor_details', { name: sensorName });

    return html`
      <div id="plant-battery">
        <div
          class="battery tooltip interactive"
          role="button"
          tabindex="0"
          aria-label="${detailsLabel}"
          @click="${this._click.bind(this, entityId)}"
          @keydown="${(event) => this._handleKeyboardActivation(event, entityId)}"
        >
          <div class="tip" style="text-align:center;">${batteryLine}<br>${statusLine}</div>
          <ha-icon icon="${icon}" style="${this.config.state_color_battery ? `color: ${color};` : ''}"></ha-icon>
        </div>
      </div>
    `;
  }

  _renderNutritionTooltip(vm) {
    const hass = this.hass;
    const hasMeasurementStatus = vm.status && !isMissingSensorState(vm.status);
    const nutritionStatus = vm.readingState === SensorReadingStates.STALE
      ? localize(hass, `card.measurement_status.${SensorReadingStates.STALE}`)
      : hasMeasurementStatus
      ? localize(hass, `card.measurement_status.${vm.status}`)
      : localize(hass, `card.measurement_status.${vm.readingState}`);
    const showFertilization =
      (vm.readingState === SensorReadingStates.AVAILABLE || vm.readingState === SensorReadingStates.STALE) &&
      vm.daysUntilFertilization !== null &&
      !isNaN(vm.daysUntilFertilization);

    let fertilizationLine = nothing;
    if (showFertilization) {
      const days = Math.abs(vm.daysUntilFertilization);
      const suffix = days === 1 ? 'one' : 'many';
      const lineKey = vm.daysUntilFertilization >= 0
        ? `card.tooltip.fertilize_in_${suffix}`
        : `card.tooltip.fertilize_overdue_${suffix}`;
      fertilizationLine = html`<br>${localize(hass, lineKey, { days })}`;
    }

    const lastFertilizationLine = vm.lastFertilizationDateString
      ? html`<br>${localize(hass, 'card.tooltip.last_fertilization', { date: formatDateForDisplay(vm.lastFertilizationDateString) })}`
      : nothing;

    const nextFertilizationLine = vm.nextFertilizationDateString
      ? html`<br>${localize(hass, 'card.tooltip.next_fertilization', { date: formatDateForDisplay(vm.nextFertilizationDateString) })}`
      : nothing;

    const statusLine = localize(hass, 'card.tooltip.nutrition_status', { status: nutritionStatus });
    return html`${statusLine}${fertilizationLine}${lastFertilizationLine}${nextFertilizationLine}`;
  }

  _renderSensorVm(vm) {
    return vm.kind === 'nutrition' ? this._renderNutritionVm(vm) : this._renderMeterVm(vm);
  }

  _renderMeterVm(vm) {
    const hass = this.hass;
    const sensorName = localize(hass, `card.sensor_name.${vm.sensorType}`);
    const hasSensorValue = vm.readingState === SensorReadingStates.AVAILABLE || vm.readingState === SensorReadingStates.STALE;
    const displayValue = hasSensorValue
      ? vm.formattedValue
      : localize(hass, `card.measurement_status.${vm.readingState}`);
    const valueLine = localize(hass, 'card.tooltip.sensor_value', {
      name: sensorName,
      value: displayValue,
      unit: hasSensorValue ? vm.unitOfMeasurement : '',
    });
    const statusKey = vm.readingState === SensorReadingStates.STALE
      ? SensorReadingStates.STALE
      : (vm.readingState === SensorReadingStates.AVAILABLE && vm.status && !isMissingSensorState(vm.status) ? vm.status : '');
    const statusLine = statusKey
      ? html`<br>${localize(hass, 'card.tooltip.status', { status: localize(hass, `card.measurement_status.${statusKey}`) })}`
      : nothing;
    const tooltipContent = html`${valueLine}${statusLine}`;
    const detailsLabel = localize(this.hass, 'card.aria.sensor_details', { name: sensorName });
    const stateBadge = vm.readingState === SensorReadingStates.AVAILABLE
      ? nothing
      : html`<div class="sensor-state ${vm.readingState}">${localize(hass, `card.measurement_status.${vm.readingState}`)}</div>`;

    return html`
      <div
        class="attribute tooltip ${vm.entityId ? 'interactive' : ''}"
        role="${vm.entityId ? 'button' : nothing}"
        tabindex="${vm.entityId ? '0' : nothing}"
        aria-label="${vm.entityId ? detailsLabel : nothing}"
        @click="${this._click.bind(this, vm.entityId)}"
        @keydown="${(event) => this._handleKeyboardActivation(event, vm.entityId)}"
        data-entity="${vm.entityId}"
      >
        <div class="tip" style="text-align:center;">${tooltipContent}</div>
        <ha-icon icon="${vm.icon}" style="${this.config.state_color_icon ? `color:${vm.color};` : ''}"></ha-icon>
        <div class="meter">
          <span class="${this.config.state_color_sensor ? `${vm.meter.class}` : ''}" style="width: ${vm.meter.percentage}%;"></span>
        </div>
        <div class="sensor-value">${displayValue}</div>
        <div class="uom">${hasSensorValue ? vm.displayUnit : ''}</div>
        ${stateBadge}
      </div>
    `;
  }

  _renderNutritionVm(vm) {
    const tooltipContent = this._renderNutritionTooltip(vm);
    const hasSensorValue = vm.readingState === SensorReadingStates.AVAILABLE || vm.readingState === SensorReadingStates.STALE;
    const hasDaysValue = vm.daysUntilFertilization !== null && !isNaN(vm.daysUntilFertilization);
    const sensorValue = hasSensorValue
      ? (hasDaysValue ? vm.daysUntilFertilization : '-')
      : localize(this.hass, `card.measurement_status.${vm.readingState}`);
    const unitKey = hasDaysValue && Math.abs(vm.daysUntilFertilization) === 1 ? 'card.unit.day_one' : 'card.unit.day_many';
    const sensorName = localize(this.hass, `card.sensor_name.${vm.sensorType}`);
    const detailsLabel = localize(this.hass, 'card.aria.sensor_details', { name: sensorName });
    const stateBadge = vm.readingState === SensorReadingStates.AVAILABLE
      ? nothing
      : html`<div class="sensor-state ${vm.readingState}">${localize(this.hass, `card.measurement_status.${vm.readingState}`)}</div>`;

    return html`
      <div
        class="attribute tooltip ${vm.entityId ? 'interactive' : ''}"
        role="${vm.entityId ? 'button' : nothing}"
        tabindex="${vm.entityId ? '0' : nothing}"
        aria-label="${vm.entityId ? detailsLabel : nothing}"
        @click="${this._click.bind(this, vm.entityId)}"
        @keydown="${(event) => this._handleKeyboardActivation(event, vm.entityId)}"
        data-entity="${vm.entityId}"
      >
        <div class="tip" style="text-align:center;">${tooltipContent}</div>
        <ha-icon icon="${vm.icon}" style="${this.config.state_color_icon ? ` color:${vm.color};` : ''}"></ha-icon>
        <div class="meter">
          <span class="${this.config.state_color_sensor ? `${vm.meter.class}` : ''}" style="width: ${vm.meter.percentage}%;"></span>
        </div>
        <div class="sensor-value">${sensorValue}</div>
        <div class="uom">${hasSensorValue ? localize(this.hass, unitKey) : ''}</div>
        ${stateBadge}
      </div>
    `;
  }

  _renderSensors(hass) {
    const entities = this._entities;
    if (!entities) return nothing;

    const viewModels = (this.config.sensors || [])
      .filter((s) => s && s.isEnabled)
      .map((s) => buildSensorViewModel(s.type, hass, entities, this.config))
      .filter((vm) => vm !== null);

    if (viewModels.length === 0) return nothing;

    // Even count: distribute evenly across two columns.
    // Odd count: the last view-model spans full width below the columns.
    const leftColumnItems = [];
    const rightColumnItems = [];
    let fullWidthVm = null;

    viewModels.forEach((vm, index) => {
      if (index % 2 === 0) {
        if (index === viewModels.length - 1) {
          fullWidthVm = vm;
        } else {
          leftColumnItems.push(vm);
        }
      } else {
        rightColumnItems.push(vm);
      }
    });

    const renderVm = (vm) => this._renderSensorVm(vm);

    const sensorHtml = html`
      <div class="sensor-column sensor-column-left">
        ${join(map(leftColumnItems, renderVm), '')}
      </div>
      <div class="sensor-column">
        ${join(map(rightColumnItems, renderVm), '')}
      </div>
    `;

    if (fullWidthVm) {
      return html`${sensorHtml}${renderVm(fullWidthVm)}`;
    }

    return sensorHtml;
  }
}

customElements.define(CUSTOM_CARD_NAME, FytaPlantCard);

export class FytaPlantCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    config: { state: true },
  };

  get deviceId() {
    return this.config?.device_id || '';
  }

  _computeLabel(schema) {
    // The schema already has labels, but for grids we need this function
    // to ensure proper display of field names
    return schema.label || schema.name;
  }

  _configChanged(config) {
    console.debug('Config changed:', config);
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config };
    this.dispatchEvent(event);
  }

  _handleChange(event) {
    console.debug('Handle change:', JSON.stringify(event), event);
    const item = event.currentTarget.closest('.item');
    const sensorType = item.getAttribute('data-sensor-type');

    let config = { ...this.config };

    let configSensors = config.sensors || DEFAULT_CONFIG.sensors;
    // Update the config with the new value
    configSensors = configSensors.map((sensorSettings) => {
      if (sensorSettings.type === sensorType) {
        return { ...sensorSettings, isEnabled: event.target.checked };
      }
      return sensorSettings;
    });

    // Enable default sensors if none are enabled
    if (configSensors.reduce((accumulator, item) => accumulator + (item.isEnabled ? 1 : 0), 0) === 0) {
      configSensors = configSensors.map(({ type }) => {
         return DEFAULT_CONFIG.sensors.find((defaultSensorSettings) => defaultSensorSettings.type === type);
      });
    }

    config.sensors = configSensors;

    this._configChanged(config);
  }

  _itemMoved(event) {
    console.debug('Item moved:', JSON.stringify(event), event);
    event.stopPropagation();

    const { oldIndex, newIndex } = event.detail;

    const newItems = this.config.sensors.concat();
    newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);

    const config = { ...this.config, sensors: newItems };

    this._configChanged(config);
  }

  _valueChanged(event) {
    console.debug('Value changed:', JSON.stringify(event), event);
    if (!this.config || !this.hass) {
      return;
    }

    // Start with a fresh object with the old values
    const config = { ...this.config };

    if (event.detail?.value) {
      Object.keys(event.detail.value).forEach((key) => {
        config[key] = event.detail.value[key];
      });
    }

    this._configChanged(config);
  }

  _getSensorColor(sensorType, isEnabled) {
    if (!isEnabled) {
      return 'var(--disabled-color, #bdbdbd)';
    }

    switch (sensorType) {
      case SensorTypes.LIGHT: {
        return 'var(--yellow-color, #ffeb3b)';
      }
      case SensorTypes.MOISTURE: {
        return 'var(--blue-color, #2196f3)';
      }
      case SensorTypes.TEMPERATURE: {
        return 'var(--green-color, #4caf50)';
      }
      case SensorTypes.NUTRIENTS: {
        return 'var(--brown-color, #795548)';
      }
      case SensorTypes.SALINITY: {
        return 'var(--purple-color, #9c27b0)';
      }
      default: {
        return 'var(--disabled-color: #bdbdbd;)';
      }
    }
  }

  render() {
    if (!this.hass || !this.config) {
      return nothing;
    }

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${buildSchemaPartOne(this.hass)}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-sortable
            handle-selector=".handle"
            @item-moved=${this._itemMoved}
          >
            <div class="sensors">
              ${this.config?.sensors.map(({type, isEnabled}) => html`
                <div class="item"  data-sensor-type="${type}">
                  <div class="handle">
                    <ha-icon icon="mdi:drag"></ha-icon>
                  </div>
                  <div class="item-switch">
                    <ha-switch
                      .checked=${isEnabled}
                      @change=${this._handleChange}
                    ></ha-switch>
                  </div>
                  <div class="item-icon">
                    <ha-icon
                      icon="${SENSOR_SETTINGS[type].icon}"
                      style="color:${this._getSensorColor(type, isEnabled)}"></ha-icon>
                  </div>
                  <div class="item-label">${localize(this.hass, `card.sensor_name.${type}`)}</div>
                </div>
              `
              )}
            </div>
          </ha-sortable>
          <ha-form
            .hass=${this.hass}
            .data=${this.config}
            .schema=${buildSchemaPartTwo(this.hass)}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .item {
        display: flex;
        margin-top: 8px;
        align-items: center;
        padding: 8px;
      }
      .item .handle {
        padding-right: 16px;
        cursor: move;
        cursor: grab;
        padding-inline-start: initial;
        padding-inline-end: 8px;
        direction: var(--direction);
      }
      .item .handle > * {
        pointer-events: none;
      }
      .item .item-switch, .item .item-icon {
        padding-right: 16px;
      }
      .item .item-label {
        flex-grow: 1;
      }
      .sensors {
        margin-bottom: 12px;
      }
    `;
  }

  setConfig(config) {
    // Start with a fresh object with all defaults set
    const newConfig = parseConfig(config);

    if (newConfig.device_id !== '' && newConfig.title === '' && this.hass) {
      try {
        const device = this.hass.devices[newConfig.device_id];
        if (device && device.name) {
          newConfig.title = device.name;
        }
      } catch (error) {
        console.error('Error setting title from selected device:', error);
      }
    }

    this.config = newConfig;
  }
}

customElements.define(`${CUSTOM_CARD_NAME}-editor`, FytaPlantCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CUSTOM_CARD_NAME,
  name: 'FYTA Plant Card',
  preview: true,
  description: 'Custom card for your FYTA plant data',
});
