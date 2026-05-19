export const convertService = (
  data
) => {

  const {
    type,
    value,
    from,
    to,
  } = data;

  const lengthFactors = {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  };

  const weightFactors = {
    milligram: 0.000001,
    gram: 0.001,
    kilogram: 1,
    tonne: 1000,
    ounce: 0.0283495,
    pound: 0.453592,
    stone: 6.35029,
  };

  // Validation
  if (
    !type ||
    value === undefined ||
    !from ||
    !to
  ) {
    throw new Error(
      "Input fields are missing"
    );
  }

  if (
    typeof value !==
      "number" ||
    Number.isNaN(value)
  ) {
    throw new Error(
      "Value must be a number"
    );
  }

  // Temperature
  if (
    type ===
    "temperature"
  ) {

    let celsius;

    // Convert to Celsius
    if (
      from ===
      "celsius"
    ) {
      celsius =
        value;
    }

    else if (
      from ===
      "fahrenheit"
    ) {
      celsius =
        (value - 32) *
        (5 / 9);
    }

    else if (
      from ===
      "kelvin"
    ) {
      celsius =
        value -
        273.15;
    }

    else {
      throw new Error(
        "Invalid temperature unit"
      );
    }

    let result;

    // Convert from Celsius
    if (
      to ===
      "celsius"
    ) {
      result =
        celsius;
    }

    else if (
      to ===
      "fahrenheit"
    ) {
      result =
        (celsius * 9) /
          5 +
        32;
    }

    else if (
      to ===
      "kelvin"
    ) {
      result =
        celsius +
        273.15;
    }

    else {
      throw new Error(
        "Invalid temperature unit"
      );
    }

    return result;
  }

  // Length / Weight
  let selectedFactors;

  if (
    type ===
    "length"
  ) {
    selectedFactors =
      lengthFactors;
  }

  else if (
    type ===
    "weight"
  ) {
    selectedFactors =
      weightFactors;
  }

  else {
    throw new Error(
      "Invalid type"
    );
  }

  if (
    !(from in
      selectedFactors) ||
    !(to in
      selectedFactors)
  ) {
    throw new Error(
      "Invalid unit"
    );
  }

  const baseValue =
    value *
    selectedFactors[
      from
    ];

  const result =
    baseValue /
    selectedFactors[
      to
    ];

  return result;
};