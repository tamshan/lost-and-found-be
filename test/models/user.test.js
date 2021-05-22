const mongoose = require('mongoose')
const User = require('../../models/user')

describe('User Model Test', () => {
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('create & save user successfully', async () => {
    const userData = {
      username: 'osvald',
      password: 'Password123$',
      roles: ['user'],
      name: {
        displayName: 'Osvald Oliver',
        firstName: 'Osvald',
        lastName: 'Oliver'
      },
      birthdate: '1980-01-01',
      gender: 'Male',
      contactnos: [{ data: '99552888', label: 'Mobile' }],
      emails: [{ data: 'test@mail.com', label: 'Personal' }],
      status: 'Newbie',
      rank: 'Rookie',
      signupdate: '2021-05-05'
    }

    const validUser = new User(userData)
    const savedUser = await validUser.save()
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined()
    expect(savedUser.username).toBe(userData.username)
    expect(savedUser.password).toBe(userData.password)
    expect(savedUser.roles).toEqual(expect.arrayContaining(userData.roles))
    expect(savedUser.name).toMatchObject(userData.name)
    expect(new Date(savedUser.birthdate)).toEqual(new Date(userData.birthdate))
    expect(savedUser.gender).toBe(userData.gender)
    expect(savedUser.contactnos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ data: '99552888', label: 'Mobile' })
      ])
    )
    expect(savedUser.emails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ data: 'test@mail.com', label: 'Personal' })
      ])
    )
    expect(savedUser.status).toBe(userData.status)
    expect(savedUser.rank).toBe(userData.rank)
    expect(new Date(savedUser.signupdate)).toEqual(new Date(userData.signupdate))
  })

  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert user successfully, but the field(s) not defined in schema should be undefined', async () => {
    const userWithInvalidField = new User({
      username: 'max',
      name: { displayname: 'Max Nicholson', firstname: 'Max', lastname: 'Nicholson' },
      gender: 'Male',
      nickname: 'Handsome Max'
    })
    const savedUserWithInvalidField = await userWithInvalidField.save()
    expect(savedUserWithInvalidField._id).toBeDefined()
    expect(savedUserWithInvalidField.nickname).toBeUndefined()
  })

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it('create user without required field should fail', async () => {
    const userWithoutRequiredField = new User({ name: { displayname: 'Failed User', firstname: 'Failed', lastname: 'User' } })
    let err
    try {
      // const savedUserWithoutRequiredField = await userWithoutRequiredField.save()
      // error = savedUserWithoutRequiredField
      await userWithoutRequiredField.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.username).toBeDefined()
  })
})
