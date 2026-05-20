import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns api health status', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'ragnarok-leveling-api',
    });
  });
});