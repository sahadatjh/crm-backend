import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findAll(): Promise<Record<string, any>> {
    const settingsList = await this.settingRepository.find();
    const settingsMap: Record<string, any> = {};
    
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return settingsMap;
  }

  async getByKey(key: string): Promise<any> {
    const setting = await this.settingRepository.findOneBy({ key });
    return setting ? setting.value : null;
  }

  async update(dto: UpdateSettingsDto): Promise<{ message: string }> {
    const keys = Object.keys(dto.settings);
    
    for (const key of keys) {
      let setting = await this.settingRepository.findOneBy({ key });
      
      if (!setting) {
        setting = this.settingRepository.create({ key, value: dto.settings[key] });
      } else {
        setting.value = dto.settings[key];
      }
      
      await this.settingRepository.save(setting);
    }
    
    return { message: 'Settings updated successfully' };
  }
}
