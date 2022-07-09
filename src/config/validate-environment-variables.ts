import * as yup from 'yup';
import { ConfigValue } from '.';

const environmentVariablesSchema = yup.object().shape({
  NODE_ENV: yup
    .string()
    .oneOf(['development', 'production'])
    .default('development'),
  NEXT_PUBLIC_REST_API_ENDPOINT: yup.string().required(),
  NEXT_PUBLIC_WEBSITE_URL: yup.string().required(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: yup.string().required(),
});

export function validateEnvironmentVariables() {
  environmentVariablesSchema
    .validate(
      Object.fromEntries(
        Object.keys(ConfigValue).map((key) => [
          key,
          ConfigValue[key as keyof typeof ConfigValue],
        ])
      ),
      {
        abortEarly: false,
      }
    )
    .catch(function (err) {
      throw new Error(
        `Please set the following environment variables: ${err.errors.join(
          ', '
        )}`
      );
    });
}
