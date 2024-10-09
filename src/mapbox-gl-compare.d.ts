declare module 'mapbox-gl-compare' {
    import MapboxGL from 'mapbox-gl';
    export default class MapboxCompare {
      constructor(beforeMap: mapboxgl.Map, afterMap: mapboxgl.Map, container: HTMLElement, options?: any);
      remove(): void;
    }
  }
  