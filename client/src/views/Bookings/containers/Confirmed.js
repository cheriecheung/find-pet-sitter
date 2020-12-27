import React from 'react';
import ItemCard from '../components/ItemCard';
import { LinkButton, OutlinedButton } from '../../../components/UIComponents';
import { useTranslation } from 'react-i18next';

function Confirmed({
  t,
  bookingType,
  bookings,
  onCompleteBooking
}) {
  const renderActionButtons = (id, hasPaid) =>
    bookingType === 'sitting_jobs' ? (
      <ConfirmedJob
        id={id}
        hasPaid={hasPaid}
        onCompleteBooking={() => onCompleteBooking(id)}
      />
    ) : (
        <ConfirmedService hasPaid={hasPaid} />
      );

  return (
    <>
      {Array.isArray(bookings) &&
        bookings.length > 0 &&
        bookings.map((data, index) => {
          const { id } = data || {}

          return (
            <ItemCard
              key={id}
              t={t}
              bookingType={bookingType}
              data={data}
              renderActionButtons={renderActionButtons}
              status="confirmed"
            />
          );
        })}

      {bookingType === 'sitting_jobs' && bookings.length === 0 && (
        <span>{t('bookings.no_jobs', { status: t('bookings.confirmed').toLowerCase() })}</span>
      )}

      {bookingType === 'sitting_service' && bookings.length === 0 && (
        <>
          <span>
            {t('bookings.no_service', { status: t('bookings.confirmed').toLowerCase() })}
          </span>

          <span>
            {t('bookings.go_to')}
            <LinkButton to="/find" variant="colored">
              &nbsp;{t('header.find_sitter')}&nbsp;
            </LinkButton>
            {t('bookings.find_sitter')}
          </span>
        </>
      )}
    </>
  );
}

export default Confirmed;

function ConfirmedJob({ hasPaid, onCompleteBooking }) {
  const { t } = useTranslation();
  console.log({ hasPaid })

  return hasPaid ? (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <OutlinedButton onClick={onCompleteBooking}>
        {t('bookings.complete')}
      </OutlinedButton>
    </div>
  ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span>{t('bookings.await_payment')}</span>
      </div>
    );
}

function ConfirmedService({ hasPaid }) {
  const { t } = useTranslation();

  console.log({ hasPaid___________: hasPaid })

  return hasPaid ? (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <span>{t('bookings.await_completion')}</span>
    </div>
  ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LinkButton
          to={{ pathname: '/payment', state: { stripeAccountId: 'acct_1HYCiyART4JEToPd' } }}
          variant="bordered"
        >
          {t('bookings.pay_now')}
        </LinkButton>
      </div>
    );
}
