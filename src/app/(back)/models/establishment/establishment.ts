import { create, update } from "./setters";
import {
  countByEmail,
  countByPhone,
  listByAuthor,
  verifyIfManagerIsFromEstablishment,
  verifyIfIsAuthorFromEstablishment,
  validateEstablishment,
  getLocaleInfos,
  count,
  findBy,
} from "./getters";

const establishmentModel = {
  create,
  countByEmail,
  countByPhone,
  count,
  update,
  listByAuthor,
  findBy,
  verifyIfManagerIsFromEstablishment,
  verifyIfIsAuthorFromEstablishment,
  validateEstablishment,
  getLocaleInfos,
};

export { establishmentModel };
