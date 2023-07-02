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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBikeById, updateBikeById } from 'apiSdk/bikes';
import { Error } from 'components/error';
import { bikeValidationSchema } from 'validationSchema/bikes';
import { BikeInterface } from 'interfaces/bike';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function BikeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BikeInterface>(
    () => (id ? `/bikes/${id}` : null),
    () => getBikeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BikeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBikeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bikes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BikeInterface>({
    initialValues: data,
    validationSchema: bikeValidationSchema,
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
            Edit Bike
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="model" mb="4" isInvalid={!!formik.errors?.model}>
              <FormLabel>Model</FormLabel>
              <Input type="text" name="model" value={formik.values?.model} onChange={formik.handleChange} />
              {formik.errors.model && <FormErrorMessage>{formik.errors?.model}</FormErrorMessage>}
            </FormControl>
            <FormControl
              id="availability_status"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.availability_status}
            >
              <FormLabel htmlFor="switch-availability_status">Availability Status</FormLabel>
              <Switch
                id="switch-availability_status"
                name="availability_status"
                onChange={formik.handleChange}
                value={formik.values?.availability_status ? 1 : 0}
              />
              {formik.errors?.availability_status && (
                <FormErrorMessage>{formik.errors?.availability_status}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<CompanyInterface>
              formik={formik}
              name={'company_id'}
              label={'Select Company'}
              placeholder={'Select Company'}
              fetcher={getCompanies}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
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
    entity: 'bike',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BikeEditPage);
