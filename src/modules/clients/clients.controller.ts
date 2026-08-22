import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../shared/enums/permissions.enum';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequirePermissions(Permission.CLIENTS_CREATE)
  @ApiOperation({ summary: 'Create a new client profile' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @RequirePermissions(Permission.CLIENTS_READ)
  @ApiOperation({ summary: 'List all clients with pagination, search & filter' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions(Permission.CLIENTS_READ)
  @ApiOperation({ summary: 'Get a single client profile with linked projects' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Client retrieved' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.CLIENTS_UPDATE)
  @ApiOperation({ summary: 'Update client details' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.CLIENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete (archive) a client record' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Client archived successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }

  @Get(':id/communications')
  @RequirePermissions(Permission.CLIENTS_READ)
  @ApiOperation({ summary: 'List client communication history' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Communication history retrieved' })
  getCommunications(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.getCommunications(id);
  }

  @Post(':id/communications')
  @RequirePermissions(Permission.CLIENTS_UPDATE)
  @ApiOperation({ summary: 'Add a new communication log for a client' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Communication log added' })
  addCommunication(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommunicationDto,
  ) {
    return this.clientsService.addCommunication(id, dto);
  }
}
