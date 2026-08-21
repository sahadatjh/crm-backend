import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from './entities/client.entity';
import { ClientCommunication } from './entities/client-communication.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientCommunication)
    private readonly communicationRepository: Repository<ClientCommunication>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(query: QueryClientDto) {
    const { page, limit, search, status, tag } = query;
    const skip = (page - 1) * limit;

    const qb = this.clientRepository
      .createQueryBuilder('client')
      .where('client.deleted_at IS NULL');

    if (search) {
      qb.andWhere(
        '(client.company_name ILIKE :search OR client.contact_person ILIKE :search OR client.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      qb.andWhere('client.status = :status', { status });
    }

    if (tag) {
      // simple-array stores as CSV, so we search the string
      qb.andWhere('client.tags ILIKE :tag', { tag: `%${tag}%` });
    }

    qb.orderBy('client.created_at', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { communications: true },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<{ message: string }> {
    const client = await this.findOne(id);
    await this.clientRepository.softRemove(client);
    return { message: `Client "${client.companyName}" has been archived.` };
  }

  async getCommunications(clientId: string): Promise<ClientCommunication[]> {
    await this.findOne(clientId); // ensure client exists
    return this.communicationRepository.find({
      where: { client: { id: clientId } },
      order: { communicationDate: 'DESC' },
    });
  }

  async addCommunication(
    clientId: string,
    dto: CreateCommunicationDto,
  ): Promise<ClientCommunication> {
    const client = await this.findOne(clientId);
    const communication = this.communicationRepository.create({
      ...dto,
      client,
    });
    return this.communicationRepository.save(communication);
  }
}
