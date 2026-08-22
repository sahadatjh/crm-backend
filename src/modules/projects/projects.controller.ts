import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ──────────────── Projects CRUD ────────────────

  @Post()
  @RequirePermissions('projects.create')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @RequirePermissions('projects.read')
  @ApiOperation({ summary: 'List all projects with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  findAll(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('projects.read')
  @ApiOperation({ summary: 'Get project details including milestones and members' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('projects.update')
  @ApiOperation({ summary: 'Update project details, status, budget, or team members' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('projects.delete')
  @ApiOperation({ summary: 'Soft delete (archive) a project' })
  @ApiResponse({ status: 200, description: 'Project archived successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }

  // ──────────────── Milestones ────────────────

  @Get(':id/milestones')
  @RequirePermissions('projects.read')
  @ApiOperation({ summary: 'List all milestones for a project' })
  @ApiResponse({ status: 200, description: 'Milestones retrieved successfully.' })
  getMilestones(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.getMilestones(id);
  }

  @Post(':id/milestones')
  @RequirePermissions('projects.update')
  @ApiOperation({ summary: 'Create a new milestone for a project' })
  @ApiResponse({ status: 201, description: 'Milestone created successfully.' })
  createMilestone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMilestoneDto,
  ) {
    return this.projectsService.createMilestone(id, dto);
  }

  @Patch(':id/milestones/:milestoneId')
  @RequirePermissions('projects.update')
  @ApiOperation({ summary: 'Update a milestone status or details' })
  @ApiResponse({ status: 200, description: 'Milestone updated successfully.' })
  @ApiResponse({ status: 404, description: 'Milestone not found.' })
  updateMilestone(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.projectsService.updateMilestone(id, milestoneId, dto);
  }

  @Delete(':id/milestones/:milestoneId')
  @RequirePermissions('projects.update')
  @ApiOperation({ summary: 'Delete a project milestone' })
  @ApiResponse({ status: 200, description: 'Milestone deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Milestone not found.' })
  deleteMilestone(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
  ) {
    return this.projectsService.deleteMilestone(id, milestoneId);
  }
}
