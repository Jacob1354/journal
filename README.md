# journal
This project combines an hourly schedule and a mood journal

## Important notes
========================
 - No race condition protection if a user opens multiple sessions

## Future improvements
========================
 - Add db migration
 - More robust session token creation
 - Prettier UI
 - More complex db error (ex: trying again a few times depending on the sqlite error code)
 - Being able to remove an account
 - Server logs
 - Server commands (rest db, shutdown, etc.)
 - Make tests fully independant
