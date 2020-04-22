import {
  generateOrdinalNumber,
  makeArraysEqual,
  findIndexOfLastDigitOfNewOrdinal,
  makeNewOrdinalBase,
  numbersAreValid,
  generateMiddleValue,
  curriedAddThree,
} from "./api";
import { number } from "prop-types";

const makeItIntoDigits = (ordinals: Array<any>) => {
  return ordinals.sort((x, y) => x - y).map((t) => t.toString().split(""));
};
const digitsToTestInFindingIndexOfLast = makeItIntoDigits([1.29, 1.3]);
const digitsForMakingBase = makeItIntoDigits([1.0, 1.3]);

const numbers = [1.1, 1.2];
const numbersAsDigits = makeItIntoDigits(numbers);
const numbersMadeEqual = makeArraysEqual(
  numbersAsDigits[0],
  numbersAsDigits[1]
);
const indexOfLastDigitOfNewOrdinal = findIndexOfLastDigitOfNewOrdinal(
  numbersMadeEqual[0],
  numbersMadeEqual[1]
);
const newOrdinalBase = makeNewOrdinalBase(
  numbersMadeEqual[0],
  indexOfLastDigitOfNewOrdinal
);

test("main should return 1.2 given 1 and 1.5", () => {
  expect(generateOrdinalNumber(numbers)).toBe(1.15);
});

test("makeArraysEqual should return 1.0 and 1.5 given 1 and 1.5", () => {
  expect(makeArraysEqual(numbersAsDigits[0], numbersAsDigits[1])).toStrictEqual(
    [
      ["1", ".", "1"],
      ["1", ".", "2"],
    ]
  );
});

test("findIndexOfLastDigitOfNewOrdinal for 1.1 and 1.2 should be 2", () => {
  expect(
    findIndexOfLastDigitOfNewOrdinal(["1", ".", "1"], ["1", ".", "2"])
  ).toBe(2);
});

test("makeNewOrdinalBase should return 1. when given 1.0 and 1.5", () => {
  expect(
    makeNewOrdinalBase(numbersMadeEqual[0], indexOfLastDigitOfNewOrdinal)
  ).toStrictEqual(["1", ".", "1"]);
});

test("generateMiddleValue should return 1.2", () => {
  expect(
    generateMiddleValue(
      +numbersMadeEqual[0][indexOfLastDigitOfNewOrdinal],
      +numbersMadeEqual[1][indexOfLastDigitOfNewOrdinal],
      newOrdinalBase
    )
  ).toBe(1.15);
});

test("generateMiddleValue should return 1.2", () => {
  expect(generateMiddleValue(1, 2, ["1", ".", "1"])).toBe(1.15);
});

test("main should return 1.15 given 1.1 and 1.2", () => {
  expect(generateOrdinalNumber([1.1, 1.2])).toBe(1.15);
});
test("main should return 1.34 given 1.3 and 1.38", () => {
  expect(generateOrdinalNumber([1.3, 1.38])).toBe(1.34);
});
test("main should return 1.2 given 1 and 1.8", () => {
  expect(generateOrdinalNumber([1, 1.5])).toBe(1.2);
});

test("makeNewOrdinalBase should return 1. when given 1 and 2", () => {
  expect(
    makeNewOrdinalBase(
      makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0],
      findIndexOfLastDigitOfNewOrdinal(
        makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0],
        makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[1]
      )
    )
  ).toStrictEqual(["1", ".", "0"]);
});
test("findIndexOfLastDigitOfNewOrdinal for 1 and 1.3 should be 2", () => {
  expect(
    findIndexOfLastDigitOfNewOrdinal(
      makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0],
      makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[1]
    )
  ).toBe(2);
});

test("makeOrdinalBase should show 1.", () => {
  console.log(
    makeNewOrdinalBase(
      digitsForMakingBase[0],
      findIndexOfLastDigitOfNewOrdinal(
        digitsForMakingBase[0],
        digitsForMakingBase[1]
      )
    )
  );
});

test("should return 3 for 1.29 and 1.3", () => {
  expect(
    findIndexOfLastDigitOfNewOrdinal(
      digitsToTestInFindingIndexOfLast[0],
      digitsToTestInFindingIndexOfLast[1]
    )
  ).toBe(3);
});

test("numbersAreValid should return false given one undefined", () => {
  expect(numbersAreValid([undefined, 12])).toBe(false);
});

test("numbersAreValid should return false given one null", () => {
  expect(numbersAreValid([null, 12])).toBe(false);
});

test("main should return numbers are not valid", () => {
  expect(generateOrdinalNumber([undefined, 1])).toBe(
    console.error("number not valid")
  );
});
test("what main returns given 1 and 1.5", () => {
  console.log(generateOrdinalNumber([1, 1.5]));
});

test("", () => {
  console.log(
    makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0].slice(
      0,
      findIndexOfLastDigitOfNewOrdinal(
        makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0],
        makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[1]
      ) + 1
    )
  );
});
console.log(digitsForMakingBase);

console.log(
  findIndexOfLastDigitOfNewOrdinal(
    makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[0],
    makeArraysEqual(digitsForMakingBase[0], digitsForMakingBase[1])[1]
  )
);
