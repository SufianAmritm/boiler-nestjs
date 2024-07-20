import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { SignUpDto } from '../../auth/dto/sign-up.dto';

@Injectable()
export class UserMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, User, SignUpDto);

      //  todo customize profile
      //  .forMember(
      //    destination => destination.name,
      //    opts => opts.mapFrom(source => source.username)
      //  )
      //   .forMember(
      //     destination => destination.email,
      //     opts => opts.mapFrom(source => source.userEmail)
      //   );

      createMap(mapper, SignUpDto, User);
    };
  }
}
