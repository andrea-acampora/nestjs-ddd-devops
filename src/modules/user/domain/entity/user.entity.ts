import { UserProps } from '../data/user.props';

export class User {
  private readonly _id: string;
  private readonly _props: UserProps;

  constructor(id: string, props: UserProps) {
    this._id = id;
    this._props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  get id(): string {
    return this._id;
  }

  get props(): UserProps {
    return this._props;
  }
}
