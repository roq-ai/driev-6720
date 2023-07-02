import * as yup from 'yup';

export const rateValidationSchema = yup.object().shape({
  daily_rate: yup.number().integer().required(),
  weekly_rate: yup.number().integer().required(),
  monthly_rate: yup.number().integer().required(),
  bike_id: yup.string().nullable(),
});
