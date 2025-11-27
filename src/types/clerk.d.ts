export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      activeSpaceId?: number;
      lastSwitched?: string;
    };
  }
}
