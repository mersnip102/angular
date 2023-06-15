import { Moment } from "moment";
import { IMyDate } from "mydatepicker";
import * as uuid from "uuid";

export class doituonginfo {
  id: number;
  code: string | undefined;
  name: string;
  checked: boolean;
}

export class doituonginfoInput {
  id: number;
  name: string;
  isActive: boolean;
  ngayNhacViec: Moment;
  nhacTruoc: number;
  noiDung: string;
  isChecked: boolean;
  isDotXuat: boolean;
  isDisabled: boolean;
  type: number;
  ngayNV: IMyDate;
}

export class DoiTuongUser {
  userId: number;
  doituonginfoInput: doituonginfoInput[];
}
