import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserRole } from '../../../roles/constants';
import { Role } from '../../../roles/entities';
import { User } from '../../../users/entities';
import { HashService } from '../../../utils/hash';
import { Travel } from '../../../travels/entities';
import { Tour } from '../../../tours/entities';

const exampleTravels = [
  {
    name: 'Jordan 360°',
    description:
      'Jordan 360°: the perfect tour to discover the suggestive Wadi Rum desert, the ancient beauty of Petra, and much more.\n\nVisiting Jordan is one of the most fascinating things that everyone has to do once in their life.You are probably wondering "Why?". Well, that\'s easy: because this country keeps several passions! During our tour in Jordan, you can range from well-preserved archaeological masterpieces to trekkings, from natural wonders excursions to ancient historical sites, from camels trek in the desert to some time to relax.\nDo not forget to float in the Dead Sea and enjoy mineral-rich mud baths, it\'s one of the most peculiar attractions. It will be a tour like no other: this beautiful country leaves a memorable impression on everyone.',
    numberOfDays: 8,
    moods: {
      nature: 80,
      relax: 20,
      history: 90,
      culture: 30,
      party: 10,
    },
    tours: [
      {
        name: 'ITJOR20211101',
        startingDate: new Date('2024-11-01'),
        endingDate: new Date('2024-11-09'),
        price: 1999,
      },
      {
        name: 'ITJOR20211112',
        startingDate: new Date('2024-11-12'),
        endingDate: new Date('2024-11-20'),
        price: 1899,
      },
    ],
  },
  {
    name: 'Iceland: hunting for the Northern Lights',
    description:
      "Why visit Iceland in winter? Because it is between October and March that this land offers the spectacle of the Northern Lights, one of the most incredible and magical natural phenomena in the world, visible only near the earth's two magnetic poles. Come with us on WeRoad to explore this land of ice and fire, full of contrasts and natural variety, where the energy of waterfalls and geysers meets the peace of the fjords... And when the ribbons of light of the aurora borealis twinkle in the sky before our enchanted eyes, we will know that we have found what we were looking for.",
    numberOfDays: 8,
    moods: {
      nature: 100,
      relax: 30,
      history: 10,
      culture: 20,
      party: 10,
    },
    tours: [
      {
        name: 'ITJOR20211125',
        startingDate: new Date('2024-11-25'),
        endingDate: new Date('2024-12-03'),
        price: 2149,
      },
      {
        name: 'ITICE20211101',
        startingDate: new Date('2024-11-01'),
        endingDate: new Date('2024-11-08'),
        price: 1999,
      },
    ],
  },
  {
    name: 'United Arab Emirates: from Dubai to Abu Dhabi',
    description:
      'At Dubai and Abu Dhabi everything is huge and majestic: here futuristic engineering works and modern infrastructures meet historical districts, local souks (typical bazars), desert and the sea. In this tour we’ll discover Dubai, where we’ll get on top of the highest skyscraper ever built, the Burj Khalifa. We’ll then take a walk at the Dubai Mall, the biggest mall on the planet, and we’ll spend a night in the desert, with the sight of the skyline on the horizon keeping us company. Then, it will be Abu Dhabi’s tourn! Sheik Zayed’s Grand Mosque’s white marble awaits for us to remain stoked in front of its wonderfulness, and the sea will invade us with peacefulness. UAE are all to discover, we’ll just get a taste of it, but we guarantee you’ll get quite the idea!',
    numberOfDays: 7,
    moods: {
      nature: 30,
      relax: 40,
      history: 20,
      culture: 80,
      party: 70,
    },
    tours: [
      {
        name: 'ITARA20211221',
        startingDate: new Date('2024-12-21'),
        endingDate: new Date('2024-12-28'),
        price: 1899,
      },
      {
        name: 'ITARA20211222',
        startingDate: new Date('2024-01-03'),
        endingDate: new Date('2024-01-10'),
        price: 1499,
      },
    ],
  },
];

@Injectable()
export class SeedService {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    private readonly hashService: HashService,
  ) {}

  async seed() {
    const roles = await this.createRoles();
    await this.createUsers(roles);
    await this.createTravels();
  }

  async createRoles(): Promise<Role[]> {
    const rolesRepository = this.defaultDataSource.getRepository(Role);

    await Promise.all(
      Object.values(UserRole).map((role) => {
        return rolesRepository.upsert(
          rolesRepository.create({
            name: role,
          }),
          {
            conflictPaths: {
              name: true,
            },
            skipUpdateIfNoValuesChanged: true,
          },
        );
      }),
    );

    return rolesRepository.find();
  }

  async createUsers(roles: Role[]): Promise<void> {
    const usersRepository = this.defaultDataSource.getRepository(User);
    const existingUsers = await usersRepository.findBy({
      email: In(roles.map((role) => this.createEmailByRoleName(role.name))),
    });

    for (const role of roles) {
      const email = this.createEmailByRoleName(role.name);
      const existingUser = existingUsers.find((user) => user.email === email);

      const rolesToAssign = [];

      if (role.name === UserRole.Admin) {
        rolesToAssign.push(...roles);
      } else if (role.name === UserRole.Editor) {
        rolesToAssign.push(
          ...roles.filter((role) => role.name !== UserRole.Admin),
        );
      } else {
        rolesToAssign.push(role);
      }

      if (!existingUser) {
        usersRepository.save(
          usersRepository.create({
            email,
            password: await this.hashService.getHash(role.name),
            roles: rolesToAssign,
          }),
        );
      }
    }
  }

  async createTravels(): Promise<void> {
    const travelsRepository = this.defaultDataSource.getRepository(Travel);
    const toursRepository = this.defaultDataSource.getRepository(Tour);
    const existingTravels = await travelsRepository.find({
      take: 1,
    });

    if (existingTravels.length === 0) {
      await travelsRepository.save(
        exampleTravels.map((travel) =>
          travelsRepository.create({
            ...travel,
            tours: travel.tours.map((tour) => toursRepository.create(tour)),
          }),
        ),
      );
    }
  }

  createEmailByRoleName(role: UserRole): string {
    return `${role}@weroad.com`.toLowerCase();
  }
}
