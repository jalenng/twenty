
const TimerSystem = require('../modules/TimerSystem')
const BreakSystem = require('../modules/BreakSystem')
const NotificationSystem = require('../modules/NotificationSystem')
const AppSnapshotSystem = require('../modules/AppSnapshotSystem')
const BlockerSystem = require('../modules/BlockerSystem')

global.systems = {
  timer: new TimerSystem(),
  break: new BreakSystem(),
  notification: new NotificationSystem(),
  appSnapshot: new AppSnapshotSystem(),
  blocker: new BlockerSystem()
}
