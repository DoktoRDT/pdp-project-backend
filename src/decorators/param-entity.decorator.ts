import { Injectable, NotFoundException, Param, PipeTransform } from '@nestjs/common';
import { FindOneOptions, getConnection } from 'typeorm';

type EntityConstructor<T> = new () => T;
type Options<T> = Omit<FindOneOptions<T>, 'where'>;

@Injectable()
class Transformer<T> implements PipeTransform<string> {
  constructor(
    protected readonly entity: EntityConstructor<T>,
    protected readonly options: FindOneOptions<T>,
  ) {
  }

  async transform(id: string) {
    const connection = getConnection();
    const repo = connection.getRepository(this.entity);

    const result = await repo.findOne({
      ...this.options,
      where: { id },
    });
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}

export function ParamEntity<T>(param: string, entity: EntityConstructor<T>, options?: Options<T>) {
  return Param(param, new Transformer(entity, options));
}
