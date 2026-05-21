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
        state_color_plant: 'Expose plant state',
        preferred_image: 'Preferred plant image',
        show_scientific_name: 'Show scientific name',
        state_color_battery: 'Show battery state color',
        state_color_sensor: 'Show sensor state color',
        state_color_icon: 'Show colored state icons',
        decimals: 'Sensor reading decimals',
      },
      option: {
        display_mode: { full: 'Full', compact: 'Compact' },
        state_color_plant: { name: 'Name Color', image: 'Image Halo', disabled: 'Disabled' },
        preferred_image: { user: 'User Image', default: 'Default Image' },
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
        no_data: 'No Data',
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
        state_color_plant: 'Pflanzenstatus anzeigen',
        preferred_image: 'Bevorzugtes Pflanzenbild',
        show_scientific_name: 'Wissenschaftlichen Namen anzeigen',
        state_color_battery: 'Batterie-Statusfarbe anzeigen',
        state_color_sensor: 'Sensor-Statusfarbe anzeigen',
        state_color_icon: 'Farbige Status-Symbole anzeigen',
        decimals: 'Dezimalstellen der Sensorwerte',
      },
      option: {
        display_mode: { full: 'Vollständig', compact: 'Kompakt' },
        state_color_plant: { name: 'Namensfarbe', image: 'Bildumrandung', disabled: 'Deaktiviert' },
        preferred_image: { user: 'Eigenes Bild', default: 'Standardbild' },
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
        no_data: 'Keine Daten',
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

const PlantStautsColors = {
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
  state_color_plant: PlantStateColorState.NAME,
  state_color_sensor: true,
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
            { label: t('editor.option.state_color_plant.name'), value: PlantStateColorState.NAME },
            { label: t('editor.option.state_color_plant.image'), value: PlantStateColorState.IMAGE },
            { label: t('editor.option.state_color_plant.disabled'), value: PlantStateColorState.DISABLED },
          ],
          mode: 'box',
        },
      },
      default: DEFAULT_CONFIG.state_color_plant,
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
          mode: 'box',
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

    const leygacySensorKeyTypes = [
      SensorTypes.LIGHT,
      SensorTypes.MOISTURE,
      SensorTypes.TEMPERATURE,
      SensorTypes.SALINITY,
      LegacySensorType.NUTRITION,
    ];

    newConfig.sensors = leygacySensorKeyTypes
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

  if (newConfig.sensors.length === 0) {
    newConfig.sensors = DEFAULT_CONFIG.sensors;
  }

  // Upgrade legacy config from boolean plant state color value
  if (typeof newConfig.state_color_plant === 'boolean') {
    newConfig.state_color_plant = newConfig.state_color_plant === true ? PlantStateColorState.NAME : PlantStateColorState.IMAGE;
  }

  return newConfig;
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

    this._resetEntityIds();
  }

  _resetEntityIds() {
    this._measurementEntityIds = {
      [SensorTypes.BATTERY]: '',
      [SensorTypes.LIGHT]: '',
      [SensorTypes.MOISTURE]: '',
      [SensorTypes.TEMPERATURE]: '',
      [SensorTypes.SALINITY]: '',
    };

    this._stateEntityIds = {
      [SensorTypes.LIGHT_STATE]: '',
      [SensorTypes.MOISTURE_STATE]: '',
      [SensorTypes.NUTRIENTS_STATE]: '',
      [SensorTypes.PLANT_STATE]: '',
      [SensorTypes.SALINITY_STATE]: '',
      [SensorTypes.TEMPERATURE_STATE]: '',
    };

    this._otherEntityIds = {
      [SensorTypes.FERTILIZATION_LAST]: '',
      [SensorTypes.FERTILIZATION_NEXT]: '',
      [SensorTypes.PLANT_IMAGE_DEFAULT]: '',
      [SensorTypes.PLANT_IMAGE_USER]: '',
      [SensorTypes.SCIENTIFIC_NAME]: '',
    };
  }

  _createEntityIdMaps() {
    return {
      measurementEntityIds: {
        [SensorTypes.BATTERY]: '',
        [SensorTypes.LIGHT]: '',
        [SensorTypes.MOISTURE]: '',
        [SensorTypes.TEMPERATURE]: '',
        [SensorTypes.SALINITY]: '',
      },
      stateEntityIds: {
        [SensorTypes.LIGHT_STATE]: '',
        [SensorTypes.MOISTURE_STATE]: '',
        [SensorTypes.NUTRIENTS_STATE]: '',
        [SensorTypes.PLANT_STATE]: '',
        [SensorTypes.SALINITY_STATE]: '',
        [SensorTypes.TEMPERATURE_STATE]: '',
      },
      otherEntityIds: {
        [SensorTypes.FERTILIZATION_LAST]: '',
        [SensorTypes.FERTILIZATION_NEXT]: '',
        [SensorTypes.PLANT_IMAGE_DEFAULT]: '',
        [SensorTypes.PLANT_IMAGE_USER]: '',
        [SensorTypes.SCIENTIFIC_NAME]: '',
      },
    };
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
    return this._calculateCardSize(50);
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

  _calculateDaysFromNow(inputDateString) {
    if (!inputDateString) return null;

    // Create Date object for the current date - use local midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Create Date object for the input date handling ISO input format (YYYY-MM-DDThh:mm:ss)
    const inputDate = new Date(inputDateString);

    // Calculate time difference in milliseconds
    const timeDifference = inputDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
    return Math.ceil(timeDifference / DAY_IN_MILLISECONDS);
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

  _getStateColor(stateType, hass) {
    switch (stateType) {
      case SensorTypes.LIGHT_STATE:
      case SensorTypes.MOISTURE_STATE:
      case SensorTypes.NUTRIENTS_STATE:
      case SensorTypes.SALINITY_STATE:
      case SensorTypes.TEMPERATURE_STATE: {
        const entityId = this._stateEntityIds[stateType];
        const state = hass.states[entityId]?.state || MeasurementStatusStates.NO_DATA;
        return MeasurementStatusColors[state];
      }
      case SensorTypes.PLANT_STATE: {
        const entityId = this._stateEntityIds[stateType];
        const state = hass.states[entityId]?.state || PlantStatusStates.NO_SENSOR;
        return PlantStautsColors[state];
      }
      default: {
        return 'var(--primary-text-color, #ffffff)';
      }
    }
  }

  // Format date for display: Remove time component
  _formatDateForDisplay(dateString) {
    if (!dateString) return '';

    // If date contains a T (ISO format), split and return just the date part
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }

    return dateString;
  }

  // Format unit for card display (only show part before "/" if it exists)
  _formatDisplayUnit(unit) {
    if (!unit) return '';
    const parts = unit.split('/');
    return parts[0];
  }

  _formatDecimals(value, decimals = 0) {
    const numberValue = Number(value);
    return isNaN(numberValue) ? '' : numberValue.toFixed(decimals);
  }

  _formatSensorValue(sensorEntity, configDecimals) {
    const sensorValue = sensorEntity.state;
    if (configDecimals !== false) {
      return this._formatDecimals(sensorValue, configDecimals);
    }

    const entityPrecision = sensorEntity.display_precision;
    return isNaN(entityPrecision) ? sensorValue : this._formatDecimals(sensorValue, entityPrecision);
  }

  _getPlantImageSrc(hass) {
    if (this.config.preferred_image === PreferredPlantImage.USER) {
      const userImageEntityId = this._otherEntityIds[SensorTypes.PLANT_IMAGE_USER];

      if (userImageEntityId && hass.states[userImageEntityId]?.attributes.entity_picture) {
        return hass.states[userImageEntityId]?.attributes.entity_picture || '';
      }
    }

    const defaultImageEntityId = this._otherEntityIds[SensorTypes.PLANT_IMAGE_DEFAULT];
    if (defaultImageEntityId && hass.states[defaultImageEntityId]?.attributes.entity_picture) {
      return hass.states[defaultImageEntityId]?.attributes.entity_picture || '';
    }

    return '';
  };

  _handleEntity(id, hass, entityIdMaps = {
    measurementEntityIds: this._measurementEntityIds,
    stateEntityIds: this._stateEntityIds,
    otherEntityIds: this._otherEntityIds,
  }) {
    const hassState = hass.states[id];
    if (!hassState) return;

    const hassEntity = hass.entities[id];
    if (!hassEntity) return;

    if (id.startsWith('image.')) {
      if (hassEntity.translation_key === TranslationKeys.PLANT_IMAGE_USER) {
        entityIdMaps.otherEntityIds[SensorTypes.PLANT_IMAGE_USER] = hassState.entity_id;
        return;
      }
      entityIdMaps.otherEntityIds[SensorTypes.PLANT_IMAGE_DEFAULT] = hassState.entity_id;
      return;
    }

    if (id.startsWith(EntityType.IMAGE)) {
      this._plantImage = hass.states[id].attributes.entity_picture;
      return;
    }

    if (id.startsWith(EntityType.SENSOR)) {
      switch (hassEntity.translation_key) {
        case TranslationKeys.LIGHT_STATUS:
        case TranslationKeys.MOISTURE_STATUS:
        case TranslationKeys.NUTRIENTS_STATUS:
        case TranslationKeys.PLANT_STATUS:
        case TranslationKeys.SALINITY_STATUS:
        case TranslationKeys.TEMPERATURE_STATUS: {
          entityIdMaps.stateEntityIds[hassEntity.translation_key.replace('_status', '')] = hassState.entity_id;
          return;
        }

        case TranslationKeys.FERTILIZATION_LAST: {
          entityIdMaps.otherEntityIds[SensorTypes.FERTILIZATION_LAST] = hassState.entity_id;
          return;
        }
        case TranslationKeys.FERTILIZATION_NEXT: {
          entityIdMaps.otherEntityIds[SensorTypes.FERTILIZATION_NEXT] = hassState.entity_id;
          return;
        }
        case TranslationKeys.LIGHT: {
          entityIdMaps.measurementEntityIds[SensorTypes.LIGHT] = hassState.entity_id;
          return;
        }
        case TranslationKeys.SALINITY: {
          entityIdMaps.measurementEntityIds[SensorTypes.SALINITY] = hassState.entity_id;
          return;
        }
        case TranslationKeys.SCIENTIFIC_NAME: {
          entityIdMaps.otherEntityIds[SensorTypes.SCIENTIFIC_NAME] = hassState.entity_id;
          return;
        }

        default: {
          switch (hassState.attributes.device_class) {
            case DeviceClass.BATTERY:
            case DeviceClass.MOISTURE:
            case DeviceClass.TEMPERATURE: {
              entityIdMaps.measurementEntityIds[hassState.attributes.device_class] = hassState.entity_id;
              return;
            }
          }
        }
      }
    }
  }

  _resolveEntityIds(hass, deviceId) {
    const entityIdMaps = this._createEntityIdMaps();

    Object.keys(hass.entities || {})
      .filter((id) => hass.entities[id].device_id === deviceId)
      .forEach((id) => this._handleEntity(id, hass, entityIdMaps), this);

    return entityIdMaps;
  }

  _handleEntities(hass, deviceId) {
    const entityIdMaps = this._resolveEntityIds(hass, deviceId);
    this._measurementEntityIds = entityIdMaps.measurementEntityIds;
    this._stateEntityIds = entityIdMaps.stateEntityIds;
    this._otherEntityIds = entityIdMaps.otherEntityIds;
  }

  _getTrackedEntityIds(entityIdMaps) {
    return [
      ...Object.values(entityIdMaps.measurementEntityIds),
      ...Object.values(entityIdMaps.stateEntityIds),
      ...Object.values(entityIdMaps.otherEntityIds),
    ].filter(Boolean).sort();
  }

  _getEntityStateSignature(hass, entityId) {
    const state = hass.states[entityId];
    if (!state) {
      return 'missing';
    }

    if (entityId.startsWith('image.')) {
      return JSON.stringify([
        state.attributes?.entity_picture || '',
      ]);
    }

    return JSON.stringify([
      state.state,
      state.attributes?.entity_picture || '',
      state.attributes?.unit_of_measurement || '',
      state.display_precision ?? '',
    ]);
  }

  _getHassSignature(hass) {
    if (!hass || !this.config?.device_id) {
      return '';
    }

    const deviceId = this.config.device_id;
    const entityIdMaps = this._resolveEntityIds(hass, deviceId);
    const trackedEntityIds = this._getTrackedEntityIds(entityIdMaps);
    const deviceName = hass.devices?.[deviceId]?.name || '';

    return JSON.stringify({
      deviceName,
      entityIdMaps,
      trackedEntityIds,
      states: trackedEntityIds.map((entityId) => this._getEntityStateSignature(hass, entityId)),
    });
  }

  shouldUpdate(changedProps) {
    if (changedProps.has('config') || !changedProps.has('hass')) {
      return true;
    }

    const oldHass = changedProps.get('hass');
    if (!oldHass || !this.hass || !this.config?.device_id) {
      return true;
    }

    return this._getHassSignature(oldHass) !== this._getHassSignature(this.hass);
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

      .header #plant-image > img {
        border-radius: 50%;
        width: 90px;
        height: 90px;
        object-fit: cover;
        box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
        cursor: pointer;
      }

      .header #plant-image > img.state {
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
        cursor: pointer;
      }

      .header #plant-text > #scientific-name {
        color: var(--secondary-text-color, #727272);
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
      }

      .header #plant-battery {
        margin-top: 18px;
        margin-right: 16px;
        cursor: pointer;
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
        cursor: pointer;
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
        width: 30px;
        margin-right: 4px;
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

      .compact-mode .header #plant-image > img {
        width: 78px;
        height: 78px;
      }

      .compact-mode .header #plant-image > img.state {
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

    this._handleEntities(this.hass, deviceId);

    return html`
      <ha-card>
        <div id="container" class="${this.config.display_mode === DisplayMode.COMPACT ? 'compact-mode' : ''}">
          <div class="header">
            <div id="plant-image">
              <img
                src="${this._getPlantImageSrc(this.hass)}"
                class="${this.config.state_color_plant === PlantStateColorState.IMAGE ? 'state' : ''}"
                style="${this.config.state_color_plant === PlantStateColorState.IMAGE ? `border-color:${this._getStateColor(SensorTypes.PLANT_STATE, this.hass)};` : ''}"
                @click="${this._click.bind(this, this._stateEntityIds[SensorTypes.PLANT_STATE])}"
              >
            </div>
            <div id="plant-text">
              <span
                id="name"
                style="${this.config.state_color_plant === PlantStateColorState.NAME ? `color:${this._getStateColor(SensorTypes.PLANT_STATE, this.hass)};` : ''}"
                @click="${this._click.bind(this, this._stateEntityIds[SensorTypes.PLANT_STATE])}"
              >${title}</span>
              ${this.config.show_scientific_name ? html`<span id="scientific-name" @click="${this._click.bind(this, this._stateEntityIds[SensorTypes.PLANT_STATE])}">${this.hass.states[this._otherEntityIds[SensorTypes.SCIENTIFIC_NAME]]?.state || ''}</span>`: nothing}
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
    if (this._measurementEntityIds[SensorTypes.BATTERY] === '') {
      return nothing;
    }

    const entityId = this._measurementEntityIds[SensorTypes.BATTERY];
    const batteryLevel = parseInt(hass.states[entityId].state);

    // Check against the user-configured threshold
    const threshold = this.config?.battery_threshold ?? DEFAULT_CONFIG.battery_threshold;

    // Only show battery if level is at or below the threshold
    // Skip showing if threshold is 0 (never show)
    if (threshold === 0 || batteryLevel > threshold) {
      return '';
    }

    const thresholdLevels = [
      { threshold: 91, icon: 'mdi:battery', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'full' },
      { threshold: 81, icon: 'mdi:battery-90', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'good' },
      { threshold: 71, icon: 'mdi:battery-80', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'good' },
      { threshold: 61, icon: 'mdi:battery-70', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'good' },
      { threshold: 51, icon: 'mdi:battery-60', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'good' },
      { threshold: 41, icon: 'mdi:battery-50', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'medium' },
      { threshold: 31, icon: 'mdi:battery-40', color: 'var(--state-sensor-battery-high-color, #4caf50)', statusKey: 'medium' },
      { threshold: 21, icon: 'mdi:battery-30', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusKey: 'low' },
      { threshold: 11, icon: 'mdi:battery-20', color: 'var(--state-sensor-battery-medium-color, #ff9800)', statusKey: 'low' },
      { threshold: 6, icon: 'mdi:battery-10', color: 'var(--state-sensor-battery-low-color, #f44336)', statusKey: 'very_low' },
      { threshold: 0, icon: 'mdi:battery-alert', color: 'var(--state-sensor-battery-low-color, #f44336)', statusKey: 'critical' },
      { threshold: -Infinity, icon: 'mdi:battery-alert-variant-outline', color: 'var(--state-sensor-battery-low-color, #f44336)', statusKey: 'unknown' },
    ];

    const { icon, color, statusKey } = thresholdLevels.find(({ threshold }) => batteryLevel >= threshold) || { icon: 'mdi:battery-alert-variant-outline', color: 'var(--red-color, #f44336)', statusKey: 'unknown' };
    const statusText = localize(hass, `card.battery_status.${statusKey}`);
    const batteryLine = localize(hass, 'card.tooltip.battery_level', { level: batteryLevel });
    const statusLine = localize(hass, 'card.tooltip.status', { status: statusText });

    return html`
      <div id="plant-battery">
        <div class="battery tooltip" @click="${this._click.bind(this, entityId)}">
          <div class="tip" style="text-align:center;">${batteryLine}<br>${statusLine}</div>
          <ha-icon icon="${icon}" style="${this.config.state_color_battery ? `color: ${color};` : ''}"></ha-icon>
        </div>
      </div>
    `;
  }

  _calculateMeterState(sensorSettings, sensorEntity, statusState) {
    const MeterClass = {
      BAD: 'bad',
      GOOD: 'good',
      UNAVAILABLE: 'unavailable',
      WARNING: 'warning',
    };

    const sensorValue = sensorEntity !== null ? sensorEntity.state : null;
    let percentage = null;
    if (sensorValue !== null && sensorSettings.min !== null && sensorSettings.max != null) {
      const calculatedPercentage = (sensorValue - sensorSettings.min) / (sensorSettings.max - sensorSettings.min) * 100;
      percentage = Math.max(0, Math.min(100, calculatedPercentage));
    }

    switch (statusState) {
      case MeasurementStatusStates.TOO_LOW: {
        return {
          percentage: percentage !== null ? percentage : 10,
          class: MeterClass.BAD,
        };
      }
      case MeasurementStatusStates.LOW: {
        return {
          percentage: percentage !== null ? percentage : 30,
          class: MeterClass.WARNING,
        };
      }
      case MeasurementStatusStates.PERFECT: {
        return {
          percentage: percentage !== null ? percentage : 50,
          class: MeterClass.GOOD,
        };
      }
      case MeasurementStatusStates.HIGH: {
        return {
          percentage: percentage !== null ? percentage : 70,
          class: MeterClass.WARNING,
        };
      }
      case MeasurementStatusStates.TOO_HIGH: {
        return {
          percentage: percentage !== null ? percentage : 90,
          class: MeterClass.BAD,
        };
      }
      default: {
        return { percentage: 0, class: MeterClass.UNAVAILABLE };
      }
    }
  }

  _buildNutritionTooltipContent(statusState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString) {
    const hass = this.hass;
    const nutritionStatus = statusState
      ? localize(hass, `card.measurement_status.${statusState}`)
      : '';
    const showFertilization = daysUntilFertilization !== null && !isNaN(daysUntilFertilization);

    let fertilizationLine = nothing;
    if (showFertilization) {
      const days = Math.abs(daysUntilFertilization);
      const suffix = days === 1 ? 'one' : 'many';
      const lineKey = daysUntilFertilization >= 0
        ? `card.tooltip.fertilize_in_${suffix}`
        : `card.tooltip.fertilize_overdue_${suffix}`;
      fertilizationLine = html`<br>${localize(hass, lineKey, { days })}`;
    }

    const lastFertilizationLine = lastFertilizationDateString
      ? html`<br>${localize(hass, 'card.tooltip.last_fertilization', { date: this._formatDateForDisplay(lastFertilizationDateString) })}`
      : nothing;

    const nextFertilizationLine = nextFertilizationDateString
      ? html`<br>${localize(hass, 'card.tooltip.next_fertilization', { date: this._formatDateForDisplay(nextFertilizationDateString) })}`
      : nothing;

    const statusLine = localize(hass, 'card.tooltip.nutrition_status', { status: nutritionStatus });
    return html`${statusLine}${fertilizationLine}${lastFertilizationLine}${nextFertilizationLine}`;
  }

  _renderSensors(hass) {
    // Filter enabled sensors based on entity ID availability
    const visibleSensors = this.config.sensors?.filter((sensorSettings) => {
      return sensorSettings && sensorSettings.isEnabled && this._measurementEntityIds[sensorSettings.type] !== '';
    });

    if (!visibleSensors || visibleSensors.length === 0) {
      return nothing;
    }

    // Distribute items into columns considering their total number
    const leftColumnItems = [];
    const rightColumnItems = [];
    let fullWidthSensor = null;

    // Even number of sensors - distribute evenly
    // Odd number of sensors - always make the last item full-width
    visibleSensors.forEach((sensorSetting, index) => {
      if (index % 2 === 0) {
        if (index === visibleSensors.length - 1) {
          // Store the sensor that should be displayed full-width
          fullWidthSensor = sensorSetting.type;
        } else {
          leftColumnItems.push(sensorSetting.type);
        }
      } else {
        rightColumnItems.push(sensorSetting.type);
      }
    });

    // Render a single sensor
    const renderSensor = (sensorType) => {
      if (sensorType === SensorTypes.NUTRIENTS) {
        return renderNutrition();
      }

      const sensorSettings = SENSOR_SETTINGS[sensorType];
      const sensorEntityId = this._measurementEntityIds[sensorType];
      const sensorEntity = hass.states[sensorEntityId];

      const formattedSensorValue = this._formatSensorValue(sensorEntity, this.config.decimals);

      // Get proper units for display and tooltip
      const unitOfMeasurement = hass.states[sensorEntityId].attributes.unit_of_measurement || '';

      // Get the proper status entity
      let sensorStatus = '';

      const statusEntityId = this._stateEntityIds[sensorType];
      if (statusEntityId) {
        sensorStatus = hass.states[statusEntityId].state;
      }

      const color = this._getStateColor(sensorType, hass);

      // Calculate meter width and class based on status
      const meterState = this._calculateMeterState(sensorSettings, sensorEntity, sensorStatus);

      // Generate tooltip content with current value and status - use full unit
      const sensorName = localize(hass, `card.sensor_name.${sensorType}`);
      const valueLine = localize(hass, 'card.tooltip.sensor_value', {
        name: sensorName,
        value: formattedSensorValue,
        unit: unitOfMeasurement,
      });
      const statusLine = sensorStatus
        ? html`<br>${localize(hass, 'card.tooltip.status', { status: localize(hass, `card.measurement_status.${sensorStatus}`) })}`
        : nothing;
      const tooltipContent = html`${valueLine}${statusLine}`;

      return html`
        <div class="attribute tooltip" @click="${this._click.bind(this, sensorEntityId)}" data-entity="${sensorEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <ha-icon icon="${sensorSettings.icon}" style="${this.config.state_color_icon ? `color:${color};` : ''}"></ha-icon>
          <div class="meter">
            <span class="${this.config.state_color_sensor ? `${meterState.class}` : ''}" style="width: ${meterState.percentage}%;"></span>
          </div>
          <div class="sensor-value">${formattedSensorValue}</div>
          <div class="uom">${this._formatDisplayUnit(unitOfMeasurement)}</div>
        </div>
      `;
    };

    // Render nutrition status
    const renderNutrition = () => {
      const statusEntityId = this._stateEntityIds[SensorTypes.NUTRIENTS_STATE];
      const sensorState = hass.states[statusEntityId]?.state;
      const color = this._getStateColor(SensorTypes.NUTRIENTS_STATE, hass);

      // Get fertilizations date if available
      const fertiliseLastEntityId = this._otherEntityIds[SensorTypes.FERTILIZATION_LAST];
      const fertiliseNextEntityId = this._otherEntityIds[SensorTypes.FERTILIZATION_NEXT];
      let daysUntilFertilization = null;
      let lastFertilizationDateString = null;
      let nextFertilizationDateString = null;

      if (fertiliseNextEntityId && hass.states[fertiliseNextEntityId]) {
        nextFertilizationDateString = hass.states[fertiliseNextEntityId].state;
        daysUntilFertilization = this._calculateDaysFromNow(nextFertilizationDateString);
      }

      if (fertiliseLastEntityId && hass.states[fertiliseLastEntityId]) {
        lastFertilizationDateString = hass.states[fertiliseLastEntityId].state;
      }

      // Format the next fertilization date for display
      const meterState = this._calculateMeterState(SENSOR_SETTINGS[SensorTypes.NUTRIENTS], null, sensorState);

      // Build tooltip content
      const tooltipContent = this._buildNutritionTooltipContent(sensorState, daysUntilFertilization, lastFertilizationDateString, nextFertilizationDateString);
      const sensorValue = daysUntilFertilization !== null && !isNaN(daysUntilFertilization) ? daysUntilFertilization : '-';

      return html`
        <div class="attribute tooltip" @click="${this._click.bind(this, statusEntityId)}" data-entity="${statusEntityId}">
          <div class="tip" style="text-align:center;">${tooltipContent}</div>
          <ha-icon icon="${SENSOR_SETTINGS[SensorTypes.NUTRIENTS].icon}" style="${this.config.state_color_icon ? ` color:${color};` : ''}"></ha-icon>
          <div class="meter">
            <span class="${this.config.state_color_sensor ? `${meterState.class}` : ''}" style="width: ${meterState.percentage}%;"></span>
          </div>
          <div class="sensor-value">${sensorValue}</div>
          <div class="uom">${localize(hass, Math.abs(daysUntilFertilization) === 1 ? 'card.unit.day_one' : 'card.unit.day_many')}</div>
        </div>
      `;
    };

    // Render sensors in two columns
    let sensorHtml = html`
      <div class="sensor-column sensor-column-left">
        ${join(
          map(leftColumnItems, (sensor) => renderSensor(sensor)),
          ''
        )}
      </div>
      <div class="sensor-column">
        ${join(
          map(rightColumnItems, (sensor) => renderSensor(sensor)),
          ''
        )}
      </div>
    `;

    // Add full-width item if needed
    if (fullWidthSensor) {
      return html`${sensorHtml}${renderSensor(fullWidthSensor)}`;
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
                    <ha-icon icon="mdi:drag"></ha-svg-icon>
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
                      style="color:${this._getSensorColor(type, isEnabled)}"></ha-svg-icon>
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
