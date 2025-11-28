import { SafeUser } from "@/models/RSUser";
import { ChangeEvent, Dispatch, FocusEvent, SetStateAction } from "react";

type ChildrenType = Readonly<{
  children: React.ReactNode;
}>;

type TextInputProps = {
  title: string;
  type: string;
  name: string;
  value: string | undefined;
  error: string | undefined;
  blur: boolean | undefined;
  placeholder?: string;
  textarea?: boolean;
  divClass?: string;
  dir?: string;
  changeHandler: (e: ChangeEvent<any>) => void;
  blurHandler: (e: FocusEvent<any>) => void;
};

type CheckBoxProps = {
  title: string;
  name: string;
  id: string;
  error?: string | undefined;
  touched?: boolean | undefined;
  checked: boolean | undefined;
  onChange: (e: ChangeEvent<any>) => void;
  onBlur?: (e: FocusEvent<any>) => void;
};

type TextListProps = {
  title: string;
  value: string[];
  field: String;
  formik: any;
};

type RadioInputProps = {
  title: string;
  name: string;
  value: string | undefined;
  error: string | undefined;
  blur: boolean | undefined;
  checked: boolean;
  divClass?: string;
  onChange: () => void;
  onBlur: () => void;
};

type FilterItemsProps = {
  title: string;
  children?: React.ReactNode;
};

type FilterInputProps = {
  type: string;
  name: string;
  value: string | number;
  className?: string;
  title?: string;
  data?: any;
  checking?: boolean;
  onChange: (e: ChangeEvent<any>) => void;
};

type PriceRangeFilterProps = {
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
};

type FilterTagProps = {
  tag: string;
  filterOf: string;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
};

interface LoginType {
  email: string;
  password: string;
}

interface RegisterType extends LoginType {
  confirmPassword: string;
}

interface FetchUserType {
  loading: boolean;
  user: SafeUser | null | any;
  error: string | undefined;
}

interface DetailsItemType {
  title: string;
  property: string | null | undefined;
  bioType?: boolean;
}

interface ChangePasswordType {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface FiltersType {
  fileType?: "rent" | "mortgage" | "buy" | null;
  category?: "villa" | "apartment" | "store" | "office" | "land" | null;
  areaMeterStart?: number | string;
  areaMeterEnd?: number | string;
  minPrice?: number | string | null;
  maxPrice?: number | string | null;
  minRent?: number | string | null;
  maxRent?: number | string | null;
  search?: string;
  sort?: string | null;
}

export type {
  ChildrenType,
  TextInputProps,
  CheckBoxProps,
  RadioInputProps,
  TextListProps,
  FilterItemsProps,
  FilterInputProps,
  PriceRangeFilterProps,
  FilterTagProps,
  LoginType,
  RegisterType,
  FetchUserType,
  DetailsItemType,
  ChangePasswordType,
  FiltersType,
};
