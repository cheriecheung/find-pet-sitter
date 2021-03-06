import React from 'react';
import { EllipsisParagraph, WrapLayout } from '../../../components/UIComponents'

function Experience({ t, sitterInfo }) {
  const {
    experience,
    hasCat,
    hasVolunteered,
    hasMedicationSkills,
    hasInjectionSkills,
    hasCertification,
    hasGroomingSkills
  } = sitterInfo;

  const skillSet = [
    {
      value: hasCat,
      icon: <i className="fas fa-cat sitter-profile" />,
      title: t('sitter_form.has_cat')
    },
    {
      value: hasVolunteered,
      icon: <i className="fas fa-hand-holding-heart sitter-profile" />,
      title: t('sitter_form.volunteer')
    },
    {
      value: hasMedicationSkills,
      icon: <i className="fas fa-pills sitter-profile" />,
      title: t('sitter_form.medication')
    },
    {
      value: hasInjectionSkills,
      icon: <i className="fas fa-syringe sitter-profile" />,
      title: t('sitter_form.injection')
    },
    {
      value: hasCertification,
      icon: <i className="fas fa-award sitter-profile" />,
      title: t('sitter_form.certificate')
    },
    {
      value: hasGroomingSkills,
      icon: <i className="fas fa-cut sitter-profile" />,
      title: t('sitter_form.grooming')
    },
  ]

  const possessedSkills = skillSet.filter(({ value }) => value)

  return (
    <>
      <EllipsisParagraph>{experience}</EllipsisParagraph>

      {possessedSkills.length > 0 &&
        <>
          <br />
          <span>{t('sitter_profile.skills_summary')}:</span>
          <br />
          <br />

          {possessedSkills.map(({ icon, title }) => (
            <div style={{ marginBottom: 15 }} key={title}>
              {icon}
              <span>{title}</span>
            </div>
          ))}
        </>
      }
    </>
  );
}

export default Experience;
