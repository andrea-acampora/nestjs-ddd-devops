export interface Mapper<DomainEntity, PersistenceModel, ResponseDTO = unknown> {
  toDomain(record: PersistenceModel): DomainEntity;

  toPersistence(entity: DomainEntity): PersistenceModel;

  toResponse?(entity: DomainEntity): ResponseDTO;
}
