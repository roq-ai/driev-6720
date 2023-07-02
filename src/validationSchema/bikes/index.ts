import * as yup from 'yup';

export const bikeValidationSchema = yup.object().shape({
  model: yup.string().required(),
  availability_status: yup.boolean().required(),
  company_id: yup.string().nullable(),
});
