import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../shared/enums/permissions.enum';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @RequirePermissions(Permission.SETTINGS_READ)
  @ApiOperation({ summary: 'Get all system settings as key-value pairs' })
  @ApiResponse({ status: 200, description: 'Returns settings object.' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Patch()
  @RequirePermissions(Permission.SETTINGS_UPDATE)
  @ApiOperation({ summary: 'Update multiple settings at once (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings updated.' })
  update(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.update(updateSettingsDto);
  }
}
