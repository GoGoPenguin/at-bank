import { fakerZH_TW as faker } from "@faker-js/faker";
import { JOB_TYPES, SERVICE_CONTENTS, type Job } from "../../types/job.type";
import { cities } from "../../utils/address.utils";

const createJob = (): Job => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  date: faker.date.future(),
  title: faker.lorem.words(3),
  company: faker.company.name(),
  type: faker.helpers.arrayElement(JOB_TYPES),
  hours: faker.number.int({ min: 1, max: 8 }),
  wage: faker.number.int({ min: 1000, max: 100000, multipleOf: 1000 }),
  vacancies: faker.number.int({ min: 1, max: 10 }),
  location: faker.helpers.arrayElement(cities),
  address: faker.location.streetAddress(),
  startedAt: faker.date.anytime(),
  notes: faker.lorem.paragraph(),
  saved: false,
  applicationStatus: undefined,
  head: faker.person.fullName(),
  contact: faker.person.fullName(),
  contactPhone: faker.phone.number(),
  contactEmail: faker.internet.email(),
  taxId: faker.string.numeric({ length: 8 }),
  companyAddress: faker.location.streetAddress(),
  serviceContent: faker.helpers.arrayElement(SERVICE_CONTENTS),
  tournamentName: faker.company.name(),
  numberOfTournaments: faker.number.int({ min: 1, max: 5 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});

const mockJobs: Job[] = faker.helpers
  .multiple(createJob, { count: 1000 })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default mockJobs;
