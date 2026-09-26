import { Dimensions } from "../../constants/dimensions.js";
import { EnumManager } from "../enum.js";

export const DIMENSION_ENUM_KEY = "dimension";
EnumManager.register(
    DIMENSION_ENUM_KEY,
    Object.keys({ ...Dimensions }).filter((d) => d !== "all")
);
