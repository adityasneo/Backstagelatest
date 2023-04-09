import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,

      gitlab: providers.gitlab.create({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            const [id] = email?.split('@') ?? '';
            const entityRef = {
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id,
            };
            try {
              await ctx.findCatalogUser({ entityRef });
            } catch (error) {
              if (error instanceof NotFoundError) {
                // findCatalogUser will throw a NotFoundError if the User is not found in the Catalog
                const userEntityRef = stringifyEntityRef(entityRef);
                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              }
            }
            // User exists sign them in with their Catalog User
            return ctx.signInWithCatalogUser({ entityRef });
          },
        },
      }),

      github: providers.github.create({
        signIn: {
          async resolver({ result: { fullProfile } }, ctx) {
            const id = fullProfile.username;
            if (!id) {
              throw new Error(
                `GitHub user profile does not contain a username`,
              );
            }
            const entityRef = {
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id.toLocaleLowerCase('en-US'),
            };
            try {
              await ctx.findCatalogUser({ entityRef });
            } catch (error) {
              if (error instanceof NotFoundError) {
                // findCatalogUser will throw a NotFoundError if the User is not found in the Catalog
                const userEntityRef = stringifyEntityRef(entityRef);
                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              }
            }
            // User exists sign them in with their Catalog User
            return ctx.signInWithCatalogUser({ entityRef });
          },
        },
      }),

      microsoft: providers.microsoft.create({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            const [id] = email?.split('@') ?? '';
            const entityRef = {
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id,
            };
            try {
              await ctx.findCatalogUser({ entityRef });
            } catch (error) {
              if (error instanceof NotFoundError) {
                // findCatalogUser will throw a NotFoundError if the User is not found in the Catalog
                const userEntityRef = stringifyEntityRef(entityRef);
                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              }
            }
            // User exists sign them in with their Catalog User
            return ctx.signInWithCatalogUser({ entityRef });
          },
        },
      }),

      oidc: providers.oidc.create({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            const [id] = email?.split('@') ?? '';
            const entityRef = {
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id,
            };
            try {
              await ctx.findCatalogUser({ entityRef });
            } catch (error) {
              if (error instanceof NotFoundError) {
                // findCatalogUser will throw a NotFoundError if the User is not found in the Catalog
                const userEntityRef = stringifyEntityRef(entityRef);
                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              }
            }
            // User exists sign them in with their Catalog User
            return ctx.signInWithCatalogUser({ entityRef });
          },
        },
      }),
    },
  });
}
