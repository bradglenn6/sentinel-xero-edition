// Compact GeoJSON FeatureCollection of world landmasses for zero-network D3 projection
export const WORLD_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // North America
    {
      type: "Feature",
      properties: { name: "North America" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-168, 65], [-160, 71], [-140, 70], [-125, 75], [-100, 78], [-80, 70],
          [-60, 60], [-55, 50], [-65, 45], [-75, 35], [-80, 25], [-82, 23],
          [-88, 21], [-97, 26], [-105, 20], [-95, 16], [-85, 10], [-77, 8],
          [-83, 9], [-92, 14], [-102, 18], [-107, 24], [-115, 30], [-124, 38],
          [-124, 48], [-130, 55], [-142, 60], [-165, 60], [-168, 65]
        ]]
      }
    },
    // South America
    {
      type: "Feature",
      properties: { name: "South America" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-77, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -5], [-35, -10],
          [-40, -22], [-50, -30], [-55, -40], [-65, -50], [-70, -55], [-75, -50],
          [-73, -40], [-72, -30], [-75, -20], [-80, -5], [-80, 2], [-77, 8]
        ]]
      }
    },
    // Europe
    {
      type: "Feature",
      properties: { name: "Europe" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-10, 36], [-5, 43], [0, 48], [-5, 58], [5, 62], [15, 70], [30, 71],
          [45, 68], [60, 65], [55, 55], [40, 50], [30, 45], [25, 40], [20, 37],
          [15, 38], [5, 43], [-5, 36], [-10, 36]
        ]]
      }
    },
    // United Kingdom & Ireland
    {
      type: "Feature",
      properties: { name: "British Isles" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-10, 51], [-6, 55], [-3, 58], [1, 53], [0, 50], [-5, 50], [-10, 51]
        ]]
      }
    },
    // Africa
    {
      type: "Feature",
      properties: { name: "Africa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-17, 15], [-17, 21], [-5, 36], [10, 37], [25, 32], [35, 31],
          [43, 12], [51, 12], [45, 2], [40, -10], [35, -25], [30, -32],
          [20, -35], [15, -30], [12, -15], [8, 4], [3, 6], [-10, 5],
          [-15, 10], [-17, 15]
        ]]
      }
    },
    // Asia
    {
      type: "Feature",
      properties: { name: "Asia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35, 31], [45, 40], [50, 45], [60, 65], [75, 72], [105, 75], [140, 72],
          [170, 66], [180, 65], [170, 60], [155, 58], [142, 50], [130, 42],
          [122, 30], [115, 22], [108, 18], [104, 10], [100, 2], [95, 18],
          [88, 22], [80, 10], [73, 20], [68, 25], [60, 25], [50, 26],
          [45, 13], [35, 31]
        ]]
      }
    },
    // Japan
    {
      type: "Feature",
      properties: { name: "Japan" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [130, 32], [133, 35], [140, 40], [144, 44], [142, 45], [139, 41],
          [135, 35], [130, 32]
        ]]
      }
    },
    // Southeast Asia Islands & Indonesia
    {
      type: "Feature",
      properties: { name: "Maritime Southeast Asia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [96, 5], [105, -6], [115, -8], [125, -8], [130, -4], [125, 2],
          [118, 5], [112, 2], [104, 1], [96, 5]
        ]]
      }
    },
    // Australia
    {
      type: "Feature",
      properties: { name: "Australia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [114, -22], [122, -15], [135, -12], [142, -11], [150, -22],
          [153, -28], [148, -37], [138, -35], [130, -32], [115, -34],
          [113, -25], [114, -22]
        ]]
      }
    },
    // New Zealand
    {
      type: "Feature",
      properties: { name: "New Zealand" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [166, -46], [172, -43], [178, -38], [174, -36], [172, -41], [166, -46]
        ]]
      }
    },
    // Greenland
    {
      type: "Feature",
      properties: { name: "Greenland" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-45, 60], [-35, 65], [-20, 75], [-25, 82], [-50, 83], [-60, 78],
          [-55, 70], [-50, 63], [-45, 60]
        ]]
      }
    }
  ]
};
