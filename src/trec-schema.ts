// TREC Standards Analysis and Schema Structure
// Based on official TREC SOPs (535.227 - 535.233)

export interface TRECStandardsSchema {
  // Main inspection sections based on TREC SOPs
  sections: {
    // 535.228: Structural Systems
    structural: {
      title: "Structural Systems";
      subsections: {
        foundations: {
          title: "Foundations";
          fields: ["condition", "material", "deficiencies", "comments"];
        };
        gradingDrainage: {
          title: "Grading and Drainage";
          fields: ["grading", "drainage", "gutters", "comments"];
        };
        roofCovering: {
          title: "Roof Covering Materials";
          fields: ["material", "condition", "flashing", "comments"];
        };
        roofStructure: {
          title: "Roof Structures and Attics";
          fields: ["framing", "ventilation", "insulation", "comments"];
        };
        interiorWalls: {
          title: "Interior walls, ceilings, floors, and doors";
          fields: ["walls", "ceilings", "floors", "doors", "comments"];
        };
        exteriorWalls: {
          title: "Exterior walls, doors, and windows";
          fields: ["siding", "doors", "windows", "comments"];
        };
        glazing: {
          title: "Exterior and interior glazing";
          fields: ["windows", "doors", "condition", "comments"];
        };
        stairways: {
          title: "Interior and exterior stairways";
          fields: ["railings", "structure", "safety", "comments"];
        };
        fireplaces: {
          title: "Fireplaces and chimneys";
          fields: ["fireplace", "chimney", "flue", "comments"];
        };
      };
    };

    // 535.229: Electrical Systems
    electrical: {
      title: "Electrical Systems";
      subsections: {
        serviceEntrance: {
          title: "Service Entrance and Panels";
          fields: ["service", "panels", "grounding", "comments"];
        };
        branchCircuits: {
          title: "Branch circuits, connected devices, and fixtures";
          fields: ["wiring", "outlets", "fixtures", "gfci", "comments"];
        };
      };
    };

    // 535.230: HVAC Systems
    hvac: {
      title: "Heating, Ventilation, and Air Conditioning Systems";
      subsections: {
        heatingEquipment: {
          title: "Heating Equipment";
          fields: ["type", "operation", "distribution", "comments"];
        };
        coolingEquipment: {
          title: "Cooling Equipment";
          fields: ["type", "operation", "distribution", "comments"];
        };
        ductSystems: {
          title: "Duct Systems, Chases, and Vents";
          fields: ["ducts", "insulation", "vents", "comments"];
        };
      };
    };

    // 535.231: Plumbing Systems
    plumbing: {
      title: "Plumbing Systems";
      subsections: {
        plumbingSystems: {
          title: "Plumbing Systems";
          fields: ["supply", "drainage", "fixtures", "comments"];
        };
        waterHeaters: {
          title: "Water Heaters";
          fields: ["type", "operation", "installation", "comments"];
        };
        hydroMassage: {
          title: "Hydro-massage Therapy Equipment";
          fields: ["equipment", "operation", "safety", "comments"];
        };
        gasDistribution: {
          title: "Gas distribution systems";
          fields: ["supply", "distribution", "appliances", "comments"];
        };
      };
    };

    // 535.232: Appliances
    appliances: {
      title: "Appliances";
      subsections: {
        dishwashers: {
          title: "Dishwashers";
          fields: ["operation", "installation", "condition", "comments"];
        };
        foodWasteDisposers: {
          title: "Food Waste Disposers";
          fields: ["operation", "installation", "condition", "comments"];
        };
        rangeHoods: {
          title: "Range hoods and exhaust systems";
          fields: ["operation", "venting", "condition", "comments"];
        };
        ranges: {
          title: "Electric or gas ranges, cooktops, and ovens";
          fields: ["operation", "installation", "condition", "comments"];
        };
        microwaves: {
          title: "Microwave ovens";
          fields: ["operation", "installation", "condition", "comments"];
        };
        exhaustSystems: {
          title: "Mechanical exhaust systems and bathroom heaters";
          fields: ["operation", "venting", "condition", "comments"];
        };
        garageDoors: {
          title: "Garage door operators";
          fields: ["operation", "safety", "condition", "comments"];
        };
        dryerExhaust: {
          title: "Dryer exhaust systems";
          fields: ["venting", "operation", "condition", "comments"];
        };
      };
    };

    // 535.233: Optional Systems
    optional: {
      title: "Optional Systems";
      subsections: {
        irrigation: {
          title: "Landscape irrigation (sprinkler) systems";
          fields: ["operation", "coverage", "condition", "comments"];
        };
        pools: {
          title: "Swimming pools, spas, hot tubs, and equipment";
          fields: ["equipment", "safety", "condition", "comments"];
        };
        outbuildings: {
          title: "Outbuildings";
          fields: ["structure", "electrical", "condition", "comments"];
        };
        privateWells: {
          title: "Private water wells";
          fields: ["system", "operation", "condition", "comments"];
        };
        privateSewage: {
          title: "Private sewage disposal systems";
          fields: ["system", "operation", "condition", "comments"];
        };
        builtInAppliances: {
          title: "Other built-in appliances";
          fields: ["type", "operation", "condition", "comments"];
        };
      };
    };
  };

  // TREC Rating System (I/NI/NP/D)
  ratingSystem: {
    I: "Inspected - functioning as intended, or conditions observed";
    NI: "Not Inspected - not inspected or not functioning as intended";
    NP: "Not Present - this system or component is not present";
    D: "Deficient - not functioning as intended or adversely affects habitability";
  };

  // Field types for each inspection item
  fieldTypes: {
    rating: "I/NI/NP/D selection";
    comment: "Narrative text for deficiencies, recommendations, or observations";
    photoPlaceholder: "Reference to attached photos";
    checkbox: "Yes/No or present/not present items";
  };
}

// Detailed TREC schema for template creation
export const TRECInspectionSchema = {
  standard: "TREC",
  version: "REI 7-6",
  title: "Property Inspection Report",
  
  // Property Information Section
  propertyInfo: {
    title: "Property Information",
    fields: [
      { id: "property_address", type: "text", label: "Property Address", required: true },
      { id: "inspection_date", type: "date", label: "Date of Inspection", required: true },
      { id: "inspector_name", type: "text", label: "Inspector Name", required: true },
      { id: "inspector_license", type: "text", label: "Inspector License #", required: true },
      { id: "client_name", type: "text", label: "Client Name", required: true },
      { id: "weather_conditions", type: "text", label: "Weather Conditions", required: false }
    ]
  },

  // Main inspection sections
  inspectionSections: [
    {
      id: "structural",
      title: "I. STRUCTURAL SYSTEMS",
      subsections: [
        {
          id: "foundations",
          title: "A. Foundations",
          items: [
            { id: "foundation_type", type: "comment", label: "Type of Foundation(s)", required: true },
            { id: "foundation_rating", type: "rating", label: "Rating" },
            { id: "foundation_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "grading_drainage",
          title: "B. Grading and Drainage",
          items: [
            { id: "grading_drainage_rating", type: "rating", label: "Rating" },
            { id: "grading_drainage_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "roof_covering",
          title: "C. Roof Covering Materials",
          items: [
            { id: "roof_covering_types", type: "comment", label: "Types of Roof Covering", required: true },
            { id: "roof_viewed_from", type: "comment", label: "Viewed From", required: true },
            { id: "roof_covering_rating", type: "rating", label: "Rating" },
            { id: "roof_covering_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "roof_structure",
          title: "D. Roof Structures and Attics",
          items: [
            { id: "roof_viewed_from", type: "comment", label: "Viewed From", required: true },
            { id: "insulation_depth", type: "comment", label: "Approximate Average Depth of Insulation", required: true },
            { id: "roof_structure_rating", type: "rating", label: "Rating" },
            { id: "roof_structure_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "walls",
          title: "E. Walls (Interior and Exterior)",
          items: [
            { id: "walls_rating", type: "rating", label: "Rating" },
            { id: "walls_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "ceilings_floors",
          title: "F. Ceilings and Floors",
          items: [
            { id: "ceilings_floors_rating", type: "rating", label: "Rating" },
            { id: "ceilings_floors_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "doors",
          title: "G. Doors (Interior and Exterior)",
          items: [
            { id: "doors_rating", type: "rating", label: "Rating" },
            { id: "doors_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "windows",
          title: "H. Windows",
          items: [
            { id: "windows_rating", type: "rating", label: "Rating" },
            { id: "windows_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "stairways",
          title: "I. Stairways",
          items: [
            { id: "stairways_rating", type: "rating", label: "Rating" },
            { id: "stairways_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "fireplaces_chimneys",
          title: "J. Fireplaces and Chimneys",
          items: [
            { id: "fireplaces_chimneys_rating", type: "rating", label: "Rating" },
            { id: "fireplaces_chimneys_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "porches_balconies",
          title: "K. Porches, Balconies, Decks and Carports",
          items: [
            { id: "porches_balconies_rating", type: "rating", label: "Rating" },
            { id: "porches_balconies_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_structural",
          title: "L. Other",
          items: [
            { id: "other_structural_rating", type: "rating", label: "Rating" },
            { id: "other_structural_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    },
    {
      id: "electrical",
      title: "II. ELECTRICAL SYSTEMS",
      subsections: [
        {
          id: "service_panels",
          title: "A. Service Entrance and Panels",
          items: [
            { id: "service_panels_rating", type: "rating", label: "Rating" },
            { id: "service_panels_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "branch_circuits",
          title: "B. Branch Circuits, Connected Devices and Fixtures",
          items: [
            { id: "wiring_type", type: "comment", label: "Type of Wiring", required: true },
            { id: "branch_circuits_rating", type: "rating", label: "Rating" },
            { id: "branch_circuits_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_electrical",
          title: "C. Other",
          items: [
            { id: "other_electrical_rating", type: "rating", label: "Rating" },
            { id: "other_electrical_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    },
    {
      id: "hvac",
      title: "III. HEATING, VENTILATION AND AIR CONDITIONING SYSTEMS",
      subsections: [
        {
          id: "heating",
          title: "A. Heating Equipment",
          items: [
            { id: "heating_type_systems", type: "comment", label: "Type of Systems", required: true },
            { id: "heating_energy_sources", type: "comment", label: "Energy Sources", required: true },
            { id: "heating_rating", type: "rating", label: "Rating" },
            { id: "heating_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "cooling",
          title: "B. Cooling Equipment",
          items: [
            { id: "cooling_type_system", type: "comment", label: "Type of System", required: true },
            { id: "cooling_rating", type: "rating", label: "Rating" },
            { id: "cooling_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "duct_systems",
          title: "C. Duct Systems, Chases and Vents",
          items: [
            { id: "duct_systems_rating", type: "rating", label: "Rating" },
            { id: "duct_systems_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_hvac",
          title: "D. Other",
          items: [
            { id: "other_hvac_rating", type: "rating", label: "Rating" },
            { id: "other_hvac_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    },
    {
      id: "plumbing",
      title: "IV. PLUMBING SYSTEMS",
      subsections: [
        {
          id: "plumbing_supply",
          title: "A. Plumbing Supply, Distribution Systems and Fixtures",
          items: [
            { id: "water_meter_location", type: "comment", label: "Location of water meter", required: true },
            { id: "main_water_valve_location", type: "comment", label: "Location of main water supply valve", required: true },
            { id: "static_water_pressure", type: "comment", label: "Static water pressure reading", required: true },
            { id: "supply_piping_material", type: "comment", label: "Type of supply piping material", required: true },
            { id: "plumbing_supply_rating", type: "rating", label: "Rating" },
            { id: "plumbing_supply_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "drains_waste_vents",
          title: "B. Drains, Waste and Vents",
          items: [
            { id: "drain_piping_materials", type: "comment", label: "Type of drain piping materials", required: true },
            { id: "drains_waste_vents_rating", type: "rating", label: "Rating" },
            { id: "drains_waste_vents_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "water_heating",
          title: "C. Water Heating Equipment",
          items: [
            { id: "water_heating_energy_sources", type: "comment", label: "Energy Sources", required: true },
            { id: "water_heating_capacity", type: "comment", label: "Capacity", required: true },
            { id: "water_heating_rating", type: "rating", label: "Rating" },
            { id: "water_heating_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "hydro_massage",
          title: "D. Hydro-Massage Therapy Equipment",
          items: [
            { id: "hydro_massage_rating", type: "rating", label: "Rating" },
            { id: "hydro_massage_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "gas_distribution",
          title: "E. Gas Distribution Systems and Gas Appliances",
          items: [
            { id: "gas_meter_location", type: "comment", label: "Location of gas meter", required: true },
            { id: "gas_piping_material", type: "comment", label: "Type of gas distribution piping material", required: true },
            { id: "gas_distribution_rating", type: "rating", label: "Rating" },
            { id: "gas_distribution_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_plumbing",
          title: "F. Other",
          items: [
            { id: "other_plumbing_rating", type: "rating", label: "Rating" },
            { id: "other_plumbing_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    },
    {
      id: "appliances",
      title: "V. APPLIANCES",
      subsections: [
        {
          id: "dishwashers",
          title: "A. Dishwashers",
          items: [
            { id: "dishwashers_rating", type: "rating", label: "Rating" },
            { id: "dishwashers_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "food_waste_disposers",
          title: "B. Food Waste Disposers",
          items: [
            { id: "food_waste_disposers_rating", type: "rating", label: "Rating" },
            { id: "food_waste_disposers_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "range_hood",
          title: "C. Range Hood and Exhaust Systems",
          items: [
            { id: "range_hood_rating", type: "rating", label: "Rating" },
            { id: "range_hood_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "ranges_cooktops",
          title: "D. Ranges, Cooktops and Ovens",
          items: [
            { id: "ranges_cooktops_rating", type: "rating", label: "Rating" },
            { id: "ranges_cooktops_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "microwave_ovens",
          title: "E. Microwave Ovens",
          items: [
            { id: "microwave_ovens_rating", type: "rating", label: "Rating" },
            { id: "microwave_ovens_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "mechanical_exhaust",
          title: "F. Mechanical Exhaust Vents and Bathroom Heaters",
          items: [
            { id: "mechanical_exhaust_rating", type: "rating", label: "Rating" },
            { id: "mechanical_exhaust_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "garage_door_openers",
          title: "G. Garage Door Openers",
          items: [
            { id: "garage_door_openers_rating", type: "rating", label: "Rating" },
            { id: "garage_door_openers_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "dryer_exhaust",
          title: "H. Dryer Exhaust Systems",
          items: [
            { id: "dryer_exhaust_rating", type: "rating", label: "Rating" },
            { id: "dryer_exhaust_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_appliances",
          title: "I. Other",
          items: [
            { id: "other_appliances_rating", type: "rating", label: "Rating" },
            { id: "other_appliances_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    },
    {
      id: "optional",
      title: "VI. OPTIONAL SYSTEMS",
      subsections: [
        {
          id: "landscape_irrigation",
          title: "A. Landscape Irrigation (Sprinkler) Systems",
          items: [
            { id: "landscape_irrigation_rating", type: "rating", label: "Rating" },
            { id: "landscape_irrigation_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "pools_spas",
          title: "B. Swimming Pools, Spas, Hot Tubs, and Equipment",
          items: [
            { id: "pools_construction_type", type: "comment", label: "Type of construction", required: true },
            { id: "pools_spas_rating", type: "rating", label: "Rating" },
            { id: "pools_spas_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "outbuildings",
          title: "C. Outbuildings",
          items: [
            { id: "outbuildings_rating", type: "rating", label: "Rating" },
            { id: "outbuildings_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "private_water_wells",
          title: "D. Private Water Wells",
          items: [
            { id: "wells_pump_type", type: "comment", label: "Type of Pump", required: true },
            { id: "wells_storage_equipment", type: "comment", label: "Type of Storage Equipment", required: true },
            { id: "private_water_wells_rating", type: "rating", label: "Rating" },
            { id: "private_water_wells_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "private_sewage_disposal",
          title: "E. Private Sewage Disposal Systems",
          items: [
            { id: "sewage_system_type", type: "comment", label: "Type of System", required: true },
            { id: "sewage_drain_field_location", type: "comment", label: "Location of Drain Field", required: true },
            { id: "private_sewage_disposal_rating", type: "rating", label: "Rating" },
            { id: "private_sewage_disposal_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_built_in_appliances",
          title: "F. Other Built-in Appliances",
          items: [
            { id: "other_built_in_appliances_rating", type: "rating", label: "Rating" },
            { id: "other_built_in_appliances_comments", type: "comment", label: "Comments" }
          ]
        },
        {
          id: "other_optional",
          title: "G. Other",
          items: [
            { id: "other_optional_rating", type: "rating", label: "Rating" },
            { id: "other_optional_comments", type: "comment", label: "Comments" }
          ]
        }
      ]
    }
  ],

  // Summary and recommendations section
  summary: {
    title: "SUMMARY",
    fields: [
      { id: "major_deficiencies", type: "comment", label: "Major Deficiencies" },
      { id: "safety_concerns", type: "comment", label: "Safety Concerns" },
      { id: "recommendations", type: "comment", label: "Recommendations" },
      { id: "additional_inspections", type: "comment", label: "Additional Inspections Recommended" }
    ]
  }
};