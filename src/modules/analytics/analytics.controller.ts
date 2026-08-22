import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../shared/enums/permissions.enum';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('team')
  @RequirePermissions(Permission.TEAM_READ)
  @ApiOperation({ summary: 'Get global team analytics (Productivity, Top Performers, Dept Performance)' })
  @ApiResponse({ status: 200, description: 'Returns aggregated team analytics.' })
  getTeamAnalytics() {
    return this.analyticsService.getTeamAnalytics();
  }

  @Get('users/:id/stats')
  @RequirePermissions(Permission.TEAM_READ)
  @ApiOperation({ summary: 'Get performance statistics for a specific user' })
  @ApiResponse({ status: 200, description: 'Returns user statistics (Completion rate, active tasks/projects).' })
  getUserStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.analyticsService.getUserStats(id);
  }
}
