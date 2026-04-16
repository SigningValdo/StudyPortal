import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '@/components/shared/ServiceCard';
import attestationVirement from '@/assets/images/attestation-virement.png';
import attestationLogement from '@/assets/images/attestion-logement.png';
import assurance from '@/assets/images/assurance.png';
import demandeFinancement from '@/assets/images/demande-financement.png';

const IconAVI = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 7V15C8 15.5304 8.21071 16.0391 8.58579 16.4142C8.96086 16.7893 9.46957 17 10 17H16M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14.586C14.8512 3.00006 15.1055 3.10545 15.293 3.293L19.707 7.707C19.8946 7.89449 19.9999 8.1488 20 8.414V15C20 15.5304 19.7893 16.0391 19.4142 16.4142C19.0391 16.7893 18.5304 17 18 17H16M8 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H14C14.5304 21 15.0391 20.7893 15.4142 20.4142C15.7893 20.0391 16 19.5304 16 19V17"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconLogement = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H9M19 10L21 12M19 10V20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H15M9 21C9.26522 21 9.51957 20.8946 9.70711 20.7071C9.89464 20.5196 10 20.2652 10 20V16C10 15.7348 10.1054 15.4804 10.2929 15.2929C10.4804 15.1054 10.7348 15 11 15H13C13.2652 15 13.5196 15.1054 13.7071 15.2929C13.8946 15.4804 14 15.7348 14 16V20C14 20.2652 14.1054 20.5196 14.2929 20.7071C14.4804 20.8946 14.7348 21 15 21M9 21H15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconAssurance = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 10H18.764C19.1049 10 19.4401 10.0871 19.7378 10.2531C20.0355 10.4191 20.2859 10.6584 20.4651 10.9484C20.6444 11.2383 20.7465 11.5692 20.7619 11.9098C20.7773 12.2503 20.7054 12.5891 20.553 12.894L17.053 19.894C16.8869 20.2265 16.6314 20.5061 16.3152 20.7014C15.999 20.8968 15.6347 21.0002 15.263 21H11.246C11.083 21 10.92 20.98 10.761 20.94L7 20M14 10V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11.905C11.405 3 11 3.405 11 3.905C11 4.619 10.789 5.317 10.392 5.911L7 11V20M14 10H12M7 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10H7.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFinancement = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 7V17C4 19.21 7.582 21 12 21C16.418 21 20 19.21 20 17V7M4 7C4 9.21 7.582 11 12 11C16.418 11 20 9.21 20 7M4 7C4 4.79 7.582 3 12 3C16.418 3 20 4.79 20 7M20 12C20 14.21 16.418 16 12 16C7.582 16 4 14.21 4 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Service {
  key: string;
  title: string;
  image: string;
  icon: ReactNode;
  path?: string;
}

const SERVICES: Service[] = [
  {
    key: 'attestation-virement',
    title: 'Attestation de virement irrévocable',
    image: attestationVirement,
    icon: <IconAVI />,
    path: '/services/avi',
  },
  {
    key: 'attestation-logement',
    title: 'Attestation de logement',
    image: attestationLogement,
    icon: <IconLogement />,
    path: '/services/attestation-logement',
  },
  {
    key: 'assurance',
    title: 'Assurance',
    image: assurance,
    icon: <IconAssurance />,
  },
  {
    key: 'demande-financement',
    title: 'Demande de financement',
    image: demandeFinancement,
    icon: <IconFinancement />,
    path: '/financement/nouvelle',
  },
];

export const HomePage: FC = () => {
  const navigate = useNavigate();
  return (
    <section className="h-full overflow-y-auto rounded-2xl border border-brand-border-soft bg-white p-4 sm:p-6 lg:p-8">
      <h2 className="mb-4 text-xl font-bold text-brand-primary sm:mb-6 sm:text-2xl">
        Les services Boaz
      </h2>
      <div className="flex flex-1 items-start justify-center sm:items-center sm:h-[calc(100%-60px)]">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 ">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.key}
              icon={service.icon}
              title={service.title}
              image={service.image}
              onClick={service.path ? () => navigate(service.path!) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
