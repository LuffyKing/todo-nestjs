export const SALT_OR_ROUNDS = 10;
export const jwtConstants = {
  secret: 'secretKey',
};

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export const CHECK_POLICIES_KEY = 'check_policy';
