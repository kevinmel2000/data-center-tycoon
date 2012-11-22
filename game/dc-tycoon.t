#include <adv3.h>
#include <en_us.h>

gameMain: GameMainDef
  initialPlayerChar = me
;

versionInfo: GameID
  name = 'Data Center Tycoon'
  byline = 'The Data Center Simulation Game!'
  authorEmail = 'Joshua Holbrook <josh.holbrook@gmail.com>'
  desc = 'Manage a data center! Buy hardware, research new services, etc.'
  version = '0.0.0'
  // see: http://www.tads.org/ifidgen/ifidgen
  IFID = 'E0F682F6-D6AF-4578-9CA8-940E061851D1'
;

firstRoom: Room 'The Data Center'
  "This is your data center."
;

+me: Actor
; 
