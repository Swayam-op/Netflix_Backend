import { JsInputValue } from "@prisma/client/runtime/library";
import { Prisma } from '@prisma/client';
export interface videoType{
    url? : Prisma.JsonNullValueInput;
    title? : string;
    parent? : number;
    subTitle?: string;
    description? : string
    backgroundImage? : string
    thumbnail? : string
    paid? :   boolean
}