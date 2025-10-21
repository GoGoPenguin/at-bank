import { type Job } from "../../types/job.type";

// const createJob = (): Job => ({
//   id: faker.string.uuid(),
//   title: faker.lorem.words(3),
//   type: faker.helpers.arrayElement(JOB_TYPES),
//   wage: faker.number.int({ min: 1000, max: 100000, multipleOf: 1000 }),
//   vacancies: faker.number.int({ min: 1, max: 10 }),
//   city: faker.helpers.arrayElement(cities),
//   address: faker.location.streetAddress(),
//   startedAt: faker.date.anytime(),
//   notes: faker.lorem.paragraph(),
//   isSaved: false,
//   applicationStatus: undefined,
//   head: faker.person.fullName(),
//   contact: faker.person.fullName(),
//   contactPhone: faker.phone.number(),
//   contactEmail: faker.internet.email(),
//   taxId: faker.string.numeric({ length: 8 }),
//   companyAddress: faker.location.streetAddress(),
//   serviceContent: faker.helpers.arrayElement(SERVICE_CONTENTS),
//   tournamentName: faker.company.name(),
//   numberOfTournaments: faker.number.int({ min: 1, max: 5 }),
//   createdAt: faker.date.past(),
//   updatedAt: faker.date.past(),
// });

const mockJobs: Job[] = [];

export default mockJobs;
