import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// connecting service with the repository
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto); // we have dto ready for this
  }

  findAll() {
    return this.userRepository.find(); // It will return all of the users
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id }); // It will return the user with the given id
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto); // we have dto ready for this
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
