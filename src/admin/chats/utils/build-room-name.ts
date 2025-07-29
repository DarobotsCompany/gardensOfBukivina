export class BuildRoomId {
    private ROOM_ID: string

    constructor(userTelegramId: string) {
        this.ROOM_ID = `room_${userTelegramId}`;
    }

    public get getRoomName() : string {
        return this.ROOM_ID;
    }
}