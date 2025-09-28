import { fakerZH_TW as faker } from "@faker-js/faker";
import { JOB_TYPES, type Job } from "../../types/job.type";
import { cities } from "../../utils/address.utils";

const createJob = (): Job => ({
  date: faker.date.future(),
  title: faker.lorem.words(3),
  company: faker.company.name(),
  type: faker.helpers.arrayElement(JOB_TYPES),
  hours: faker.number.int({ min: 1, max: 8 }),
  wage: faker.number.int({ min: 1000, max: 100000, multipleOf: 1000 }),
  vacancies: faker.number.int({ min: 1, max: 10 }),
  location: faker.helpers.arrayElement(cities),
  notes: faker.lorem.paragraph(),
  saved: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});

const mockJobs: Job[] = faker.helpers
  .multiple(createJob, { count: 1000 })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default mockJobs;
