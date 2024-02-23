import { faker } from '@faker-js/faker'
import { users, restaurants } from './schema'
import chalk from 'chalk'
import { db } from './connection'
import readline from 'node:readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('close', () => {
  process.exit(0)
})

const question = (query: string) =>
  new Promise((resolve) => rl.question(query, resolve))

const answer = await question(
  chalk.redBright('Your database will be reset, are you sure of that (y/n) '),
)

if (typeof answer === 'string' && answer.toLowerCase() === 'y') {
  console.log(chalk.yellow('✓ Database reset!'))
} else {
  console.log(chalk.blue('✗ Database reset canceled'))
  rl.close()
}

/**
 * Reset database
 */
await db.delete(users)
await db.delete(restaurants)

/**
 * Create customers
 */
await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log(chalk.yellow('✓ Created customers!'))

/**
 * Create manager
 */
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'adm@adm.com',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('✓ Created manager!'))

/**
 * Create manager
 */
await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('✓ Created manager!'))

console.log(chalk.greenBright('Database seeded successfully!'))

process.exit()
