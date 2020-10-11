import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormButtons, SectionContainer, SectionTitle } from '../../../components/FormComponents';
import { getSitterAccount, saveSitter } from '../../../_actions/accountActions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

import { cat_sitter_default_values as defaultValues } from '../_defaultValues'

import AboutMe from './AboutMe';
import Experience from './Experience';
import Pricing from './Pricing';
import Availability from './Availability';

function SitterProfile({ activeKey }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const methods = useForm();
  const { register, handleSubmit, watch, reset } = methods;

  useEffect(() => {
    if (activeKey === 'sitter' && id) {
      dispatch(getSitterAccount(id));
    }
  }, [activeKey, dispatch]);

  const { sitterData } = useSelector((state) => state.account);

  useEffect(() => {
    if (sitterData) {
      const {
        aboutSitter,
        experience,
        hasCat = false,
        hasVolunteered = false,
        hasMedicationSkills = false,
        hasInjectionSkills = false,
        hasCertification = false,
        hasGroomingSkills = false,
        hourlyRate,
        nightlyRate,
        unavailableDates = [],
      } = sitterData;

      reset({
        ...defaultValues,
        aboutSitter,
        experience,
        hasCat,
        hasVolunteered,
        hasMedicationSkills,
        hasInjectionSkills,
        hasCertification,
        hasGroomingSkills,
        hourlyRate: { value: hourlyRate, label: `€ ${hourlyRate},00` },
        nightlyRate: { value: nightlyRate, label: `€ ${nightlyRate},00` },
        unavailableDates: unavailableDates.map((item) => new Date(item)),
      });
    }
  }, [reset, sitterData]);

  const onSubmit = (data) => {
    const { hourlyRate, nightlyRate, unavailableDates, ...rest } = data;
    const { value: hourlyRateOptions } = hourlyRate || {};
    const { value: nightlyRateOptions } = nightlyRate || {};

    const parsedDates = unavailableDates.map((date) => {
      const parsed = moment(date).format('YYYY-MM-DD');

      return parsed;
    });

    const cleanedData = {
      hourlyRate: hourlyRateOptions,
      nightlyRate: nightlyRateOptions,
      unavailableDates: parsedDates,
      ...rest,
    };

    dispatch(saveSitter(id, cleanedData));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <a href={`/profile/catsitter/${id}`} target="_blank">
          {t('sitter_form.view_profile')}
        </a>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SectionContainer>
            <SectionTitle>{t('sitter_form.about_me')}</SectionTitle>

            <AboutMe />
          </SectionContainer>

          {/*  YEARS OF CAT CARE  */}

          <SectionContainer>
            <SectionTitle>{t('sitter_form.experience_serivce')}</SectionTitle>

            <Experience />
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>{t('sitter_form.pricing')}</SectionTitle>

            <Pricing />
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>{t('sitter_form.availability')}</SectionTitle>

            <Availability reset={reset} watch={watch} />
          </SectionContainer>

          <FormButtons onClick={() => reset(defaultValues)} />
        </form>
      </FormProvider>
    </>
  );
}

export default SitterProfile;
