export type HRDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface HRCommand {
  name: string;
  syntax: string;
  description: string;
  returns: string;
  errorCases: string[];
}

export interface HRPart {
  number: number;
  title: string;
  description: string;
  requirements: string[];
  commands: HRCommand[];
  example?: { input: string; output: string; explanation?: string };
  pseudocode?: string;
}

export interface HRProblem {
  id: string;
  title: string;
  difficulty: HRDifficulty;
  tags: string[];
  company?: string;
  source: 'HackerRank';
  usedInInterview: boolean;
  timeLimitMinutes?: number;
  summary: string;
  inputOutputFormat: string;
  outputRules: string[];
  parts: HRPart[];
  solution?: {
    language: string;
    code: string;
    notes: string;
  };
  notes?: string;
}

export const hackerrankProblems: HRProblem[] = [
  {
    id: 'proximity-request-routing',
    title: 'Proximity Request Routing',
    difficulty: 'Hard',
    tags: ['Data Structures', 'Simulation', 'Geospatial', 'System Design'],
    source: 'HackerRank',
    usedInInterview: true,
    timeLimitMinutes: 90,
    summary:
      'Build a request routing system for a global payment processing platform. The router selects the optimal datacenter based on geographic proximity, health status, and capacity constraints.',
    inputOutputFormat:
      'Your program reads commands from stdin and writes results to stdout. Each command is on a separate line.',
    outputRules: [
      'SUCCESS: Commands return OK or structured data as specified.',
      'ERROR: Commands return ERROR (no additional message).',
      'Lists: Comma-separated with no spaces (e.g., dc1,dc2,dc3).',
      'Boolean values: true or false (lowercase).',
    ],
    parts: [
      {
        number: 1,
        title: 'Datacenter Registry and Health Management',
        description:
          'Build the foundational data structures and APIs for managing datacenter registration and health status.',
        requirements: [
          'Implement datacenter registration with validation.',
          'Validate coordinates: latitude [-90, 90], longitude [-180, 180] (integers for simplicity).',
          'Validate capacity: must be > 0.',
          'Prevent duplicate registrations.',
          'Support health status management.',
          'All datacenters are initially registered as healthy with load = 0.',
        ],
        commands: [
          {
            name: 'REGISTER',
            syntax: 'REGISTER <name> <latitude> <longitude> <capacity>',
            description: 'Registers a new datacenter.',
            returns: 'OK or ERROR',
            errorCases: [
              'Datacenter with same name already exists.',
              'Invalid latitude (not in [-90, 90]).',
              'Invalid longitude (not in [-180, 180]).',
              'Invalid capacity (<= 0).',
            ],
          },
          {
            name: 'SET_HEALTHY',
            syntax: 'SET_HEALTHY <name> <true|false>',
            description: 'Sets datacenter health status.',
            returns: 'OK or ERROR',
            errorCases: ['Datacenter does not exist.'],
          },
        ],        example: {
          input: `REGISTER us-west 38 -122 100
REGISTER us-east 41 -74 150
REGISTER eu-west 52 0 200
SET_HEALTHY us-east false
REGISTER us-west 50 -100 50
REGISTER invalid 91 0 100
REGISTER invalid2 0 0 0`,
          output: `OK
OK
OK
OK
ERROR
ERROR
ERROR`,
        },      },
      {
        number: 2,
        title: 'Distance Calculation',
        description:
          'Implement the Haversine formula to calculate great-circle distances between coordinates.',
        requirements: [
          'Calculate great-circle distance using the Haversine formula.',
          "Earth's radius: 6371 km.",
          'Return distance as integer (round the value).',
        ],
        commands: [
          {
            name: 'DISTANCE',
            syntax: 'DISTANCE <lat1> <lon1> <lat2> <lon2>',
            description: 'Calculates great-circle distance between two coordinates using the Haversine formula.',
            returns: '<distance_km> as integer',
            errorCases: ['No error cases for valid integer coordinates — always returns a value.'],
          },
        ],
        pseudocode: `FUNCTION haversine_distance(loc1, loc2):
  CONSTANT earth_radius_km = 6371

  // Convert degrees to radians
  lat1_rad = loc1.latitude * π / 180
  lat2_rad = loc2.latitude * π / 180
  delta_lat = (loc2.latitude - loc1.latitude) * π / 180
  delta_lon = (loc2.longitude - loc1.longitude) * π / 180

  // Haversine formula
  a = sin²(delta_lat / 2) + cos(lat1_rad) * cos(lat2_rad) * sin²(delta_lon / 2)
  c = 2 * atan2(√a, √(1-a))
  distance = earth_radius_km * c

  RETURN distance
END FUNCTION`,
        example: {
          input: `DISTANCE 0 0 0 0
DISTANCE 38 -122 41 -74
DISTANCE 0 0 10 0
DISTANCE 36 140 -33 -71`,
          output: `0
4080
1112
17167`,
        },
      },
      {
        number: 3,
        title: 'Geographic Routing with Capacity',
        description:
          'Implement the core routing algorithm that selects the optimal datacenter based on distance, health, and capacity.',
        requirements: [
          'Route to nearest healthy datacenter with available capacity.',
          'Try datacenters in order of distance (nearest first) until finding one with capacity.',
          'Return attempted datacenters sorted by distance (only healthy DCs).',
          'Tie-breaking: if equidistant, sort alphabetically by name.',
          'Successful route increments datacenter load by 1.',
          'Datacenter load persists across multiple ROUTE commands.',
        ],
        commands: [
          {
            name: 'ROUTE',
            syntax: 'ROUTE <latitude> <longitude>',
            description:
              'Routes to nearest healthy datacenter with available capacity. Increments selected datacenter load by 1.',
            returns:
              '<selected_dc> <distance_km> <attempted_order>  —or—  NONE <attempted_order> if no capacity available. attempted_order: only healthy DCs sorted by distance, comma-separated. All values are integers.',
            errorCases: [],
          },
        ],
        example: {
          input: `REGISTER us-west 38 -122 2
REGISTER us-east 41 -74 100
ROUTE 38 -122
ROUTE 38 -122
ROUTE 38 -122`,
          output: `OK
OK
us-west 0 us-west,us-east
us-west 0 us-west,us-east
us-east 4080 us-west,us-east`,
          explanation: 'us-west has a capacity of 2. The first two ROUTE commands fill its capacity. The third ROUTE command must route to the next nearest healthy datacenter, which is us-east.',
        },
      },
    ],
    solution: {
      language: 'Java',
      notes:
        'Use a HashMap for O(1) datacenter lookups. For ROUTE, sort healthy DCs by Haversine distance, then check capacity in order. Load is mutable state — a simple int field on each DC object. Tie-break alphabetically.',
      code: `import java.util.*;

public class Solution {

    static final double EARTH_RADIUS_KM = 6371;

    static class Datacenter {
        String name;
        int lat, lon, capacity, load;
        boolean healthy;

        Datacenter(String name, int lat, int lon, int capacity) {
            this.name = name; this.lat = lat; this.lon = lon;
            this.capacity = capacity; this.load = 0; this.healthy = true;
        }

        boolean hasCapacity() { return load < capacity; }
    }

    static Map<String, Datacenter> registry = new LinkedHashMap<>();

    static int haversine(int lat1, int lon1, int lat2, int lon2) {
        double la1 = Math.toRadians(lat1), la2 = Math.toRadians(lat2);
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.pow(Math.sin(dLat / 2), 2)
                 + Math.cos(la1) * Math.cos(la2) * Math.pow(Math.sin(dLon / 2), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (int) Math.round(EARTH_RADIUS_KM * c);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();

        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split("\\s+");

            switch (parts[0]) {
                case "REGISTER": {
                    if (parts.length != 5) { sb.append("ERROR\\n"); break; }
                    String name = parts[1];
                    int lat, lon, cap;
                    try {
                        lat = Integer.parseInt(parts[2]);
                        lon = Integer.parseInt(parts[3]);
                        cap = Integer.parseInt(parts[4]);
                    } catch (NumberFormatException e) { sb.append("ERROR\\n"); break; }

                    if (registry.containsKey(name) || lat < -90 || lat > 90
                            || lon < -180 || lon > 180 || cap <= 0) {
                        sb.append("ERROR\\n");
                    } else {
                        registry.put(name, new Datacenter(name, lat, lon, cap));
                        sb.append("OK\\n");
                    }
                    break;
                }
                case "SET_HEALTHY": {
                    if (parts.length != 3 || !registry.containsKey(parts[1])) {
                        sb.append("ERROR\\n"); break;
                    }
                    registry.get(parts[1]).healthy = Boolean.parseBoolean(parts[2]);
                    sb.append("OK\\n");
                    break;
                }
                case "DISTANCE": {
                    int lat1 = Integer.parseInt(parts[1]), lon1 = Integer.parseInt(parts[2]);
                    int lat2 = Integer.parseInt(parts[3]), lon2 = Integer.parseInt(parts[4]);
                    sb.append(haversine(lat1, lon1, lat2, lon2)).append("\\n");
                    break;
                }
                case "ROUTE": {
                    int lat = Integer.parseInt(parts[1]), lon = Integer.parseInt(parts[2]);
                    // Collect healthy DCs sorted by distance, then name
                    List<Datacenter> healthy = new ArrayList<>();
                    for (Datacenter dc : registry.values()) {
                        if (dc.healthy) healthy.add(dc);
                    }
                    healthy.sort((a, b) -> {
                        int da = haversine(lat, lon, a.lat, a.lon);
                        int db = haversine(lat, lon, b.lat, b.lon);
                        if (da != db) return Integer.compare(da, db);
                        return a.name.compareTo(b.name);
                    });

                    StringJoiner order = new StringJoiner(",");
                    for (Datacenter dc : healthy) order.add(dc.name);

                    Datacenter selected = null;
                    for (Datacenter dc : healthy) {
                        if (dc.hasCapacity()) { selected = dc; break; }
                    }

                    if (selected == null) {
                        sb.append("NONE ").append(order).append("\\n");
                    } else {
                        int dist = haversine(lat, lon, selected.lat, selected.lon);
                        selected.load++;
                        sb.append(selected.name).append(" ").append(dist)
                          .append(" ").append(order).append("\\n");
                    }
                    break;
                }
                default:
                    sb.append("ERROR\\n");
            }
        }
        System.out.print(sb);
    }
}`,
    },
    notes:
      'This problem was encountered during an interview.',
  },
];
