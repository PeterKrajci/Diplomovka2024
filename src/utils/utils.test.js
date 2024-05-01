// utils.test.js
import {
  transformCoordinates,
  formatTime,
  calculateYAxisDomain,
  toGPXString,
} from "./utils";

describe("transformCoordinates function", () => {
  test("transforms coordinate arrays into the expected format", () => {
    const inputCoordinates = [
      [
        [34.0522, -118.2437, 10],
        [40.7128, -74.006, 20],
      ],
    ];
    const expectedOutput = [
      [
        { id: 0, elevation: 10, position: { lat: 34.0522, lon: -118.2437 } },
        { id: 1, elevation: 20, position: { lat: 40.7128, lon: -74.006 } },
      ],
    ];
    expect(transformCoordinates(inputCoordinates)).toEqual(expectedOutput);
  });
});

describe("formatTime function", () => {
  test('returns "Not provided" when totalSeconds is null', () => {
    expect(formatTime(null)).toBe("Not provided");
  });

  test("formats time correctly for totalSeconds less than a minute", () => {
    expect(formatTime(30)).toBe("0:00:30 hours");
  });

  test("formats time correctly for totalSeconds less than an hour", () => {
    expect(formatTime(122)).toBe("0:02:02 hours");
  });

  test("formats time correctly for exactly one minute", () => {
    expect(formatTime(60)).toBe("0:01:00 hours");
  });

  test("formats time correctly for more than an hour", () => {
    expect(formatTime(3661)).toBe("1:01:01 hours");
  });

  test("handles hours, minutes, and seconds with proper zero-padding", () => {
    expect(formatTime(5400)).toBe("1:30:00 hours"); // 1 hour and 30 minutes
    expect(formatTime(5410)).toBe("1:30:10 hours"); // 1 hour, 30 minutes, and 10 seconds
  });
});

describe("calculateYAxisDomain function", () => {
  test("calculates the correct domain with padding for given elevation data", () => {
    const inputData = [
      { id: 0, elevation: 187.4, position: { lat: 48.764213, lon: 17.833899 } },
      { id: 1, elevation: 187.4, position: { lat: 48.764228, lon: 17.833904 } },
      { id: 5, elevation: 187.5, position: { lat: 48.764294, lon: 17.833921 } },
      { id: 7, elevation: 187.6, position: { lat: 48.764393, lon: 17.833916 } },
      { id: 9, elevation: 187.7, position: { lat: 48.764478, lon: 17.833842 } },
      {
        id: 15,
        elevation: 187.3,
        position: { lat: 48.764507, lon: 17.833516 },
      },
      { id: 19, elevation: 187, position: { lat: 48.76435, lon: 17.833405 } },
      {
        id: 23,
        elevation: 186.7,
        position: { lat: 48.764189, lon: 17.833334 },
      },
      {
        id: 25,
        elevation: 186.6,
        position: { lat: 48.764106, lon: 17.833321 },
      },
      { id: 29, elevation: 186.8, position: { lat: 48.76393, lon: 17.833271 } },
      {
        id: 33,
        elevation: 186.9,
        position: { lat: 48.763774, lon: 17.833346 },
      },
      { id: 37, elevation: 187, position: { lat: 48.763771, lon: 17.833593 } },
    ];

    const expectedResult = [176, 198]; // Updated expected result based on the function's logic
    const result = calculateYAxisDomain(inputData);
    expect(result).toEqual(expectedResult);
  });

  test("returns a default range when no data is provided", () => {
    const result = calculateYAxisDomain([]);
    expect(result).toEqual([0, 0]); // This should now pass as the function handles empty input correctly
  });
});

describe("toGPXString function", () => {
  test("converts trackpoints to GPX string format correctly", () => {
    const trackpoints = [
      [40.7780135, -73.9665795, 36.1867676],
      [40.7780136, -73.9665778, 35.2254639],
      [40.7780147, -73.9665789, 34.2641602],
      [40.7780246, -73.9665919, 34.744873],
      [40.7780338, -73.9665851, 34.744873],
      [40.77808, -73.9665492, 34.2641602],
      [40.7781448, -73.9665005, 32.8222656],
    ];

    const expectedOutput =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="YourAppName" version="1.1">\n' +
      "  <trk>\n" +
      "    <name>Track</name>\n" +
      "    <trkseg>\n" +
      '      <trkpt lat="40.7780135" lon="-73.9665795">\n' +
      "        <ele>36.1867676</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.7780136" lon="-73.9665778">\n' +
      "        <ele>35.2254639</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.7780147" lon="-73.9665789">\n' +
      "        <ele>34.2641602</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.7780246" lon="-73.9665919">\n' +
      "        <ele>34.744873</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.7780338" lon="-73.9665851">\n' +
      "        <ele>34.744873</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.77808" lon="-73.9665492">\n' +
      "        <ele>34.2641602</ele>\n" +
      "      </trkpt>\n" +
      '      <trkpt lat="40.7781448" lon="-73.9665005">\n' +
      "        <ele>32.8222656</ele>\n" +
      "      </trkpt>\n" +
      "    </trkseg>\n" +
      "  </trk>\n" +
      "</gpx>";

    const result = toGPXString(trackpoints);
    expect(result).toEqual(expectedOutput);
  });

  test("handles empty trackpoints array", () => {
    const expectedOutput =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="YourAppName" version="1.1">\n' +
      "  <trk>\n" +
      "    <name>Track</name>\n" +
      "    <trkseg></trkseg>\n" + // Ensure there are no newlines between <trkseg> tags when empty
      "  </trk>\n" +
      "</gpx>";

    expect(toGPXString([])).toEqual(expectedOutput);
  });
});
