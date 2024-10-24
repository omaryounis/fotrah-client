import { jwtDecode, JwtPayload } from "jwt-decode";

import {
  AbilityBuilder,
  AbilityClass,
  createMongoAbility,
  MongoAbility,
  PureAbility,
} from "@casl/ability";
import { BehaviorSubject } from "rxjs";

export type Actions = "List" | "Edit" | "Add" | "Read" | "Delete" | "View" | "Procceed";

export type AppAbility = MongoAbility<[Actions, any]>;

export const AppAbility = PureAbility as AbilityClass<AppAbility>;

const abilityBehabiorSubject$ = new BehaviorSubject<MongoAbility>(new AppAbility());
export const abilityObservable$ = abilityBehabiorSubject$.asObservable();

function getPermissions() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return [];
  }

  const decodedAccessToken = jwtDecode(accessToken) as JwtPayload & { permissions: string[] };
  return decodedAccessToken?.permissions || [];
}

function defineAbilitiesFor(permissions: string[]) {
  const { can, rules } = new AbilityBuilder(AppAbility);

  permissions.forEach((permission) => {
    const [action, subject] = permission.split("_");
    can(action as Actions, subject);
  });

  return rules;
}

export function createAbility() {
  const permissions = getPermissions();

  const ability = createMongoAbility(defineAbilitiesFor(permissions), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    detectSubjectType: (object) => object["kind"],
  });

  abilityBehabiorSubject$.next(ability)
}

export function clearAbility() {
  abilityBehabiorSubject$.next(new AppAbility());
}
