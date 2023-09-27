import * as yup from "yup"

import { User } from "../types/User"

export const UserSchema = yup
  .object<User>({
    fullName: yup.string().required("Este campo é obrigatório"),
    document: yup.string().required("Este campo é obrigatório"),
    birthDate: yup.date(),
    email: yup
      .string()
      .email("E-mail não reconhecido")
      .required("Este campo é obrigatório"),
    emailVerified: yup.boolean().default(false),
    mobile: yup.string().required("Este campo é obrigatório"),
    zipCode: yup
      .string()
      .required("Este campo é obrigatório")
      .transform((value) => value.replace(/[^\d]+/g, "")),
    addressName: yup.string().required("Este campo é obrigatório"),
    number: yup.string().required("Este campo é obrigatório"),
    complement: yup.string(),
    position: yup.string().required("Este campo é obrigatório"),
    hiringDate: yup.string().required("Este campo é obrigatório"),
    department: yup.string().required("Este campo é obrigatório"),
    salary: yup.string().required("Este campo é obrigatório"),
    neighborhood: yup.string().required("Este campo é obrigatório"),
    city: yup.string().required("Este campo é obrigatório"),
    state: yup.string().required("Este campo é obrigatório"),
    profilePicture: yup.string(),
    situacion: yup.string().required("Este campo é obrigatório"),
  })
  .required()
