import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRate } from 'apiSdk/rates';
import { Error } from 'components/error';
import { rateValidationSchema } from 'validationSchema/rates';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BikeInterface } from 'interfaces/bike';
import { getBikes } from 'apiSdk/bikes';
import { RateInterface } from 'interfaces/rate';

function RateCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RateInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRate(values);
      resetForm();
      router.push('/rates');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RateInterface>({
    initialValues: {
      daily_rate: 0,
      weekly_rate: 0,
      monthly_rate: 0,
      bike_id: (router.query.bike_id as string) ?? null,
    },
    validationSchema: rateValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Rate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="daily_rate" mb="4" isInvalid={!!formik.errors?.daily_rate}>
            <FormLabel>Daily Rate</FormLabel>
            <NumberInput
              name="daily_rate"
              value={formik.values?.daily_rate}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('daily_rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.daily_rate && <FormErrorMessage>{formik.errors?.daily_rate}</FormErrorMessage>}
          </FormControl>
          <FormControl id="weekly_rate" mb="4" isInvalid={!!formik.errors?.weekly_rate}>
            <FormLabel>Weekly Rate</FormLabel>
            <NumberInput
              name="weekly_rate"
              value={formik.values?.weekly_rate}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('weekly_rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.weekly_rate && <FormErrorMessage>{formik.errors?.weekly_rate}</FormErrorMessage>}
          </FormControl>
          <FormControl id="monthly_rate" mb="4" isInvalid={!!formik.errors?.monthly_rate}>
            <FormLabel>Monthly Rate</FormLabel>
            <NumberInput
              name="monthly_rate"
              value={formik.values?.monthly_rate}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('monthly_rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.monthly_rate && <FormErrorMessage>{formik.errors?.monthly_rate}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BikeInterface>
            formik={formik}
            name={'bike_id'}
            label={'Select Bike'}
            placeholder={'Select Bike'}
            fetcher={getBikes}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.model}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'rate',
    operation: AccessOperationEnum.CREATE,
  }),
)(RateCreatePage);
