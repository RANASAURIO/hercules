.class public Lcom/hierro/gym/BackCb;
.super Ljava/lang/Object;
.source "BackCb.java"

# interfaces
.implements Landroid/webkit/ValueCallback;


# instance fields
.field private final act:Lcom/hierro/gym/MainActivity;


# direct methods
.method public constructor <init>(Lcom/hierro/gym/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/hierro/gym/BackCb;->act:Lcom/hierro/gym/MainActivity;

    return-void
.end method


# virtual methods
.method public onReceiveValue(Ljava/lang/Object;)V
    .locals 2

    const-string v0, "true"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_done

    iget-object v0, p0, Lcom/hierro/gym/BackCb;->act:Lcom/hierro/gym/MainActivity;

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Landroid/app/Activity;->moveTaskToBack(Z)Z

    :cond_done
    return-void
.end method
